import * as Lint from 'tslint';
import * as tsutils from 'tsutils';
import * as ts from 'typescript';

type PerProgramConfig = {
  tc: ts.TypeChecker,
  ctx: Lint.WalkContext<void>,
  // Format: filename|startPosition|endPosition
  // We use this Map to flag only the highest-level block / expressions.
  flaggedRanges: Set<string>,
};

/**
 * This linter rule tries to find dead branches in programs by looking for
 * unsatisfiable typing constraints.
 */
export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'dead-type-branch',
    description: 'This linter rule tries to find dead branches in programs ' +
        'by looking for unsatisfiable typing constraints.',
    rationale: 'Unsatisfiable type constraits indicate unreachable code.',
    options: null,
    optionsDescription: '',
    type: 'typescript',
    typescriptOnly: true,
  };

  applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program):
      Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, (ctx) => this.walk(ctx, program));
  }

  /**
   * Looks for if statements to analyze for dead branches.
   */
  private static searchForIfStatements(
      node: ts.Node, config: PerProgramConfig,
      previouslyTaggedExprs?: Set<string>): void {
    const taggedExpr = Rule.copyOrInit(previouslyTaggedExprs);

    if (!tsutils.isIfStatement(node)) {
      return node.forEachChild(
          n => Rule.searchForIfStatements(n, config, taggedExpr));
    }

    const ifNode: ts.IfStatement = node;
    Rule.searchForTypeGuardsInCondition(ifNode.expression, config)
        .forEach(g => taggedExpr.add(g));

    if (taggedExpr.size !== 0) {
      Rule.searchForExpressionsTypedAsNever(
          ifNode.thenStatement, config, taggedExpr);
      if (ifNode.elseStatement &&
          !tsutils.isIfStatement(ifNode.elseStatement)) {
        Rule.searchForExpressionsTypedAsNever(
            ifNode.elseStatement, config, taggedExpr);
      }
    }

    Rule.searchForIfStatements(ifNode.thenStatement, config, taggedExpr);
    if (ifNode.elseStatement) {
      Rule.searchForIfStatements(ifNode.elseStatement, config, taggedExpr);
    }
  }

  /**
   * Searches for expressions that are part of type-based conditions under
   * `node`, and returns a set of these, stringified. This recurses.
   * @param node Should come from inside a condition
   */
  private static searchForTypeGuardsInCondition(
      node: ts.Node, config: PerProgramConfig,
      previoustaggedExpr?: Set<string>): Set<string> {
    const taggedExpr = Rule.copyOrInit(previoustaggedExpr);

    if (tsutils.isBinaryExpression(node)) {
      const expr = node;
      const tokenKind = expr.operatorToken.kind;
      // This flags `x instanceof *`
      if (tokenKind === ts.SyntaxKind.InstanceOfKeyword) {
        taggedExpr.add(expr.left.getFullText().trim());
        return taggedExpr;
      }
      // This flags `typeof x === *` / `* === typeof x` and the == version
      if (tokenKind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
          tokenKind === ts.SyntaxKind.EqualsEqualsToken) {
        if (tsutils.isTypeOfExpression(expr.left) &&
            !tsutils.isTypeOfExpression(expr.right)) {
          taggedExpr.add(expr.left.expression.getFullText().trim());
          return taggedExpr;
        } else if (
            !tsutils.isTypeOfExpression(expr.left) &&
            tsutils.isTypeOfExpression(expr.right)) {
          taggedExpr.add(expr.right.expression.getFullText().trim());
          return taggedExpr;
        } else {
          return taggedExpr;
        }
      }
    }

    if (tsutils.isCallExpression(node)) {
      // This flags functions that formalize a type guard. Note that the results
      // with those can be weird as of TS 2.4.2: TS will use structural typing
      // here and for the resulting type inference later on for that symbol,
      // unlike for instanceof (which relies on type names).

      const callNode = node;
      const signature = config.tc.getResolvedSignature(callNode);
      if (signature && signature.declaration.type &&
          tsutils.isTypePredicateNode(signature.declaration.type)) {
        // We have either a ts.IdentifierTypePredicate or a
        // ts.ThisTypePredicate, but details are not accessible and they're
        // complex, so instead just flag arguments of the call as
        // needing investigation. This could be refined if needed.
        callNode.arguments.forEach(a => taggedExpr.add(a.getFullText().trim()));
        return taggedExpr;
      }
    }

    // Default is to recurse under this node.
    node.forEachChild(n => {
      Rule.searchForTypeGuardsInCondition(n, config).forEach(
          g => taggedExpr.add(g));
    });
    return taggedExpr;
  }


  /**
   * Looks for branches that use expressions amongst the flagged ones, and if
   * they are typed as never, flags them.
   */
  private static searchForExpressionsTypedAsNever(
      node: ts.Node, config: PerProgramConfig, taggedExprs: Set<string>): void {
    if (taggedExprs.has(node.getFullText().trim()) &&
        tsutils.isExpression(node)) {
      Rule.checkTypedAsNeverAndFlag(node, config);
    }
    return node.forEachChild(
        n => Rule.searchForExpressionsTypedAsNever(n, config, taggedExprs));
  }


  /**
   * Flags the block containing `checkedExpression` if it's both typed as never,
   * and not flagged as part of a larger block.
   */
  private static checkTypedAsNeverAndFlag(
      expr: ts.Expression, config: PerProgramConfig) {
    const exprType = config.tc.getTypeAtLocation(expr);
    if (exprType && (exprType.getFlags() & ts.TypeFlags.Never)) {
      const whereToFlag = Rule.findClosestBlockOrThenStatement(expr);
      Rule.flagIfNotAlready(whereToFlag, expr.getFullText().trim(), config);
    }
  }

  /**
   * Turns a node into a string identifying it in the context of current run.
   */
  private static nodeToRange(n: ts.Node): string {
    return `${n.getSourceFile().fileName}|${n.getStart()}|${n.getEnd()}`;
  }

  /**
   * Given a `PerRunConfig` and a node to flag as dead, flags it if a
   * larger node hasn't been flagged.
   */
  private static flagIfNotAlready(
      flagLocation: ts.Node, expression: string, config: PerProgramConfig) {
    if (Rule.parents(flagLocation)
            .every(n => !config.flaggedRanges.has(Rule.nodeToRange(n)))) {
      config.flaggedRanges.add(Rule.nodeToRange(flagLocation));
      config.ctx.addFailureAtNode(
          flagLocation,
          `This block is unreachable: TypeScript infers the type of ` +
              `'${expression}' as 'never' at this location, which means the ` +
              `previous type guard is always false.`);
    }
  }

  /**
   * Assuming `node` is a proof that a branch is dead, this function searches
   * above it in the AST to find the right level to tag as dead. That is either
   * the closest ts.Block, or the node in our path just below the closest
   * ts.IfStatement.
   */
  private static findClosestBlockOrThenStatement(node: ts.Node): ts.Node {
    while (node.parent) {
      const old = node;
      node = node.parent;
      if (tsutils.isBlock(node)) {
        return node;
      } else if (tsutils.isIfStatement(node) && old !== node.expression) {
        return old;  // condition to avoid tagging conditions
      }
    }
    throw new Error('AST appears malformed.');
  }

  /**
   * Either copies `previous`, or returns a new empty Set if `previous` is
   * undefined.
   */
  private static copyOrInit<T>(previous: Set<T>|undefined) {
    return previous ? new Set(previous) : new Set();
  }

  /**
   * Returns an ordered Array of the parents of `node`, sorted by increasing
   * distance.
   */
  private static parents(node: ts.Node): ts.Node[] {
    const parents = new Array<ts.Node>(node);
    while (node.parent) {
      parents.push(node.parent);
      node = node.parent;
    }
    return parents;
  }

  /**
   * Looks for dead branches due to typing constraints in `program`.
   */
  public walk(ctx: Lint.WalkContext<void>, program: ts.Program) {
    const tc = program.getTypeChecker();
    const config = {tc, ctx, flaggedRanges: new Set()};
    ctx.sourceFile.statements.forEach(
        n => Rule.searchForIfStatements(n, config));
  }
}
