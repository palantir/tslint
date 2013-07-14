var SyntaxKind;
(function (SyntaxKind) {
    SyntaxKind._map = [];
    SyntaxKind._map[0] = "None";
    SyntaxKind.None = 0;
    SyntaxKind._map[1] = "List";
    SyntaxKind.List = 1;
    SyntaxKind._map[2] = "SeparatedList";
    SyntaxKind.SeparatedList = 2;
    SyntaxKind._map[3] = "TriviaList";
    SyntaxKind.TriviaList = 3;
    SyntaxKind._map[4] = "WhitespaceTrivia";
    SyntaxKind.WhitespaceTrivia = 4;
    SyntaxKind._map[5] = "NewLineTrivia";
    SyntaxKind.NewLineTrivia = 5;
    SyntaxKind._map[6] = "MultiLineCommentTrivia";
    SyntaxKind.MultiLineCommentTrivia = 6;
    SyntaxKind._map[7] = "SingleLineCommentTrivia";
    SyntaxKind.SingleLineCommentTrivia = 7;
    SyntaxKind._map[8] = "SkippedTextTrivia";
    SyntaxKind.SkippedTextTrivia = 8;
    SyntaxKind._map[9] = "ErrorToken";
    SyntaxKind.ErrorToken = 9;
    SyntaxKind._map[10] = "EndOfFileToken";
    SyntaxKind.EndOfFileToken = 10;
    SyntaxKind._map[11] = "IdentifierName";
    SyntaxKind.IdentifierName = 11;
    SyntaxKind._map[12] = "RegularExpressionLiteral";
    SyntaxKind.RegularExpressionLiteral = 12;
    SyntaxKind._map[13] = "NumericLiteral";
    SyntaxKind.NumericLiteral = 13;
    SyntaxKind._map[14] = "StringLiteral";
    SyntaxKind.StringLiteral = 14;
    SyntaxKind._map[15] = "BreakKeyword";
    SyntaxKind.BreakKeyword = 15;
    SyntaxKind._map[16] = "CaseKeyword";
    SyntaxKind.CaseKeyword = 16;
    SyntaxKind._map[17] = "CatchKeyword";
    SyntaxKind.CatchKeyword = 17;
    SyntaxKind._map[18] = "ContinueKeyword";
    SyntaxKind.ContinueKeyword = 18;
    SyntaxKind._map[19] = "DebuggerKeyword";
    SyntaxKind.DebuggerKeyword = 19;
    SyntaxKind._map[20] = "DefaultKeyword";
    SyntaxKind.DefaultKeyword = 20;
    SyntaxKind._map[21] = "DeleteKeyword";
    SyntaxKind.DeleteKeyword = 21;
    SyntaxKind._map[22] = "DoKeyword";
    SyntaxKind.DoKeyword = 22;
    SyntaxKind._map[23] = "ElseKeyword";
    SyntaxKind.ElseKeyword = 23;
    SyntaxKind._map[24] = "FalseKeyword";
    SyntaxKind.FalseKeyword = 24;
    SyntaxKind._map[25] = "FinallyKeyword";
    SyntaxKind.FinallyKeyword = 25;
    SyntaxKind._map[26] = "ForKeyword";
    SyntaxKind.ForKeyword = 26;
    SyntaxKind._map[27] = "FunctionKeyword";
    SyntaxKind.FunctionKeyword = 27;
    SyntaxKind._map[28] = "IfKeyword";
    SyntaxKind.IfKeyword = 28;
    SyntaxKind._map[29] = "InKeyword";
    SyntaxKind.InKeyword = 29;
    SyntaxKind._map[30] = "InstanceOfKeyword";
    SyntaxKind.InstanceOfKeyword = 30;
    SyntaxKind._map[31] = "NewKeyword";
    SyntaxKind.NewKeyword = 31;
    SyntaxKind._map[32] = "NullKeyword";
    SyntaxKind.NullKeyword = 32;
    SyntaxKind._map[33] = "ReturnKeyword";
    SyntaxKind.ReturnKeyword = 33;
    SyntaxKind._map[34] = "SwitchKeyword";
    SyntaxKind.SwitchKeyword = 34;
    SyntaxKind._map[35] = "ThisKeyword";
    SyntaxKind.ThisKeyword = 35;
    SyntaxKind._map[36] = "ThrowKeyword";
    SyntaxKind.ThrowKeyword = 36;
    SyntaxKind._map[37] = "TrueKeyword";
    SyntaxKind.TrueKeyword = 37;
    SyntaxKind._map[38] = "TryKeyword";
    SyntaxKind.TryKeyword = 38;
    SyntaxKind._map[39] = "TypeOfKeyword";
    SyntaxKind.TypeOfKeyword = 39;
    SyntaxKind._map[40] = "VarKeyword";
    SyntaxKind.VarKeyword = 40;
    SyntaxKind._map[41] = "VoidKeyword";
    SyntaxKind.VoidKeyword = 41;
    SyntaxKind._map[42] = "WhileKeyword";
    SyntaxKind.WhileKeyword = 42;
    SyntaxKind._map[43] = "WithKeyword";
    SyntaxKind.WithKeyword = 43;
    SyntaxKind._map[44] = "ClassKeyword";
    SyntaxKind.ClassKeyword = 44;
    SyntaxKind._map[45] = "ConstKeyword";
    SyntaxKind.ConstKeyword = 45;
    SyntaxKind._map[46] = "EnumKeyword";
    SyntaxKind.EnumKeyword = 46;
    SyntaxKind._map[47] = "ExportKeyword";
    SyntaxKind.ExportKeyword = 47;
    SyntaxKind._map[48] = "ExtendsKeyword";
    SyntaxKind.ExtendsKeyword = 48;
    SyntaxKind._map[49] = "ImportKeyword";
    SyntaxKind.ImportKeyword = 49;
    SyntaxKind._map[50] = "SuperKeyword";
    SyntaxKind.SuperKeyword = 50;
    SyntaxKind._map[51] = "ImplementsKeyword";
    SyntaxKind.ImplementsKeyword = 51;
    SyntaxKind._map[52] = "InterfaceKeyword";
    SyntaxKind.InterfaceKeyword = 52;
    SyntaxKind._map[53] = "LetKeyword";
    SyntaxKind.LetKeyword = 53;
    SyntaxKind._map[54] = "PackageKeyword";
    SyntaxKind.PackageKeyword = 54;
    SyntaxKind._map[55] = "PrivateKeyword";
    SyntaxKind.PrivateKeyword = 55;
    SyntaxKind._map[56] = "ProtectedKeyword";
    SyntaxKind.ProtectedKeyword = 56;
    SyntaxKind._map[57] = "PublicKeyword";
    SyntaxKind.PublicKeyword = 57;
    SyntaxKind._map[58] = "StaticKeyword";
    SyntaxKind.StaticKeyword = 58;
    SyntaxKind._map[59] = "YieldKeyword";
    SyntaxKind.YieldKeyword = 59;
    SyntaxKind._map[60] = "AnyKeyword";
    SyntaxKind.AnyKeyword = 60;
    SyntaxKind._map[61] = "BooleanKeyword";
    SyntaxKind.BooleanKeyword = 61;
    SyntaxKind._map[62] = "BoolKeyword";
    SyntaxKind.BoolKeyword = 62;
    SyntaxKind._map[63] = "ConstructorKeyword";
    SyntaxKind.ConstructorKeyword = 63;
    SyntaxKind._map[64] = "DeclareKeyword";
    SyntaxKind.DeclareKeyword = 64;
    SyntaxKind._map[65] = "GetKeyword";
    SyntaxKind.GetKeyword = 65;
    SyntaxKind._map[66] = "ModuleKeyword";
    SyntaxKind.ModuleKeyword = 66;
    SyntaxKind._map[67] = "NumberKeyword";
    SyntaxKind.NumberKeyword = 67;
    SyntaxKind._map[68] = "SetKeyword";
    SyntaxKind.SetKeyword = 68;
    SyntaxKind._map[69] = "StringKeyword";
    SyntaxKind.StringKeyword = 69;
    SyntaxKind._map[70] = "OpenBraceToken";
    SyntaxKind.OpenBraceToken = 70;
    SyntaxKind._map[71] = "CloseBraceToken";
    SyntaxKind.CloseBraceToken = 71;
    SyntaxKind._map[72] = "OpenParenToken";
    SyntaxKind.OpenParenToken = 72;
    SyntaxKind._map[73] = "CloseParenToken";
    SyntaxKind.CloseParenToken = 73;
    SyntaxKind._map[74] = "OpenBracketToken";
    SyntaxKind.OpenBracketToken = 74;
    SyntaxKind._map[75] = "CloseBracketToken";
    SyntaxKind.CloseBracketToken = 75;
    SyntaxKind._map[76] = "DotToken";
    SyntaxKind.DotToken = 76;
    SyntaxKind._map[77] = "DotDotDotToken";
    SyntaxKind.DotDotDotToken = 77;
    SyntaxKind._map[78] = "SemicolonToken";
    SyntaxKind.SemicolonToken = 78;
    SyntaxKind._map[79] = "CommaToken";
    SyntaxKind.CommaToken = 79;
    SyntaxKind._map[80] = "LessThanToken";
    SyntaxKind.LessThanToken = 80;
    SyntaxKind._map[81] = "GreaterThanToken";
    SyntaxKind.GreaterThanToken = 81;
    SyntaxKind._map[82] = "LessThanEqualsToken";
    SyntaxKind.LessThanEqualsToken = 82;
    SyntaxKind._map[83] = "GreaterThanEqualsToken";
    SyntaxKind.GreaterThanEqualsToken = 83;
    SyntaxKind._map[84] = "EqualsEqualsToken";
    SyntaxKind.EqualsEqualsToken = 84;
    SyntaxKind._map[85] = "EqualsGreaterThanToken";
    SyntaxKind.EqualsGreaterThanToken = 85;
    SyntaxKind._map[86] = "ExclamationEqualsToken";
    SyntaxKind.ExclamationEqualsToken = 86;
    SyntaxKind._map[87] = "EqualsEqualsEqualsToken";
    SyntaxKind.EqualsEqualsEqualsToken = 87;
    SyntaxKind._map[88] = "ExclamationEqualsEqualsToken";
    SyntaxKind.ExclamationEqualsEqualsToken = 88;
    SyntaxKind._map[89] = "PlusToken";
    SyntaxKind.PlusToken = 89;
    SyntaxKind._map[90] = "MinusToken";
    SyntaxKind.MinusToken = 90;
    SyntaxKind._map[91] = "AsteriskToken";
    SyntaxKind.AsteriskToken = 91;
    SyntaxKind._map[92] = "PercentToken";
    SyntaxKind.PercentToken = 92;
    SyntaxKind._map[93] = "PlusPlusToken";
    SyntaxKind.PlusPlusToken = 93;
    SyntaxKind._map[94] = "MinusMinusToken";
    SyntaxKind.MinusMinusToken = 94;
    SyntaxKind._map[95] = "LessThanLessThanToken";
    SyntaxKind.LessThanLessThanToken = 95;
    SyntaxKind._map[96] = "GreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanToken = 96;
    SyntaxKind._map[97] = "GreaterThanGreaterThanGreaterThanToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanToken = 97;
    SyntaxKind._map[98] = "AmpersandToken";
    SyntaxKind.AmpersandToken = 98;
    SyntaxKind._map[99] = "BarToken";
    SyntaxKind.BarToken = 99;
    SyntaxKind._map[100] = "CaretToken";
    SyntaxKind.CaretToken = 100;
    SyntaxKind._map[101] = "ExclamationToken";
    SyntaxKind.ExclamationToken = 101;
    SyntaxKind._map[102] = "TildeToken";
    SyntaxKind.TildeToken = 102;
    SyntaxKind._map[103] = "AmpersandAmpersandToken";
    SyntaxKind.AmpersandAmpersandToken = 103;
    SyntaxKind._map[104] = "BarBarToken";
    SyntaxKind.BarBarToken = 104;
    SyntaxKind._map[105] = "QuestionToken";
    SyntaxKind.QuestionToken = 105;
    SyntaxKind._map[106] = "ColonToken";
    SyntaxKind.ColonToken = 106;
    SyntaxKind._map[107] = "EqualsToken";
    SyntaxKind.EqualsToken = 107;
    SyntaxKind._map[108] = "PlusEqualsToken";
    SyntaxKind.PlusEqualsToken = 108;
    SyntaxKind._map[109] = "MinusEqualsToken";
    SyntaxKind.MinusEqualsToken = 109;
    SyntaxKind._map[110] = "AsteriskEqualsToken";
    SyntaxKind.AsteriskEqualsToken = 110;
    SyntaxKind._map[111] = "PercentEqualsToken";
    SyntaxKind.PercentEqualsToken = 111;
    SyntaxKind._map[112] = "LessThanLessThanEqualsToken";
    SyntaxKind.LessThanLessThanEqualsToken = 112;
    SyntaxKind._map[113] = "GreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanEqualsToken = 113;
    SyntaxKind._map[114] = "GreaterThanGreaterThanGreaterThanEqualsToken";
    SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken = 114;
    SyntaxKind._map[115] = "AmpersandEqualsToken";
    SyntaxKind.AmpersandEqualsToken = 115;
    SyntaxKind._map[116] = "BarEqualsToken";
    SyntaxKind.BarEqualsToken = 116;
    SyntaxKind._map[117] = "CaretEqualsToken";
    SyntaxKind.CaretEqualsToken = 117;
    SyntaxKind._map[118] = "SlashToken";
    SyntaxKind.SlashToken = 118;
    SyntaxKind._map[119] = "SlashEqualsToken";
    SyntaxKind.SlashEqualsToken = 119;
    SyntaxKind._map[120] = "SourceUnit";
    SyntaxKind.SourceUnit = 120;
    SyntaxKind._map[121] = "QualifiedName";
    SyntaxKind.QualifiedName = 121;
    SyntaxKind._map[122] = "ObjectType";
    SyntaxKind.ObjectType = 122;
    SyntaxKind._map[123] = "FunctionType";
    SyntaxKind.FunctionType = 123;
    SyntaxKind._map[124] = "ArrayType";
    SyntaxKind.ArrayType = 124;
    SyntaxKind._map[125] = "ConstructorType";
    SyntaxKind.ConstructorType = 125;
    SyntaxKind._map[126] = "GenericType";
    SyntaxKind.GenericType = 126;
    SyntaxKind._map[127] = "InterfaceDeclaration";
    SyntaxKind.InterfaceDeclaration = 127;
    SyntaxKind._map[128] = "FunctionDeclaration";
    SyntaxKind.FunctionDeclaration = 128;
    SyntaxKind._map[129] = "ModuleDeclaration";
    SyntaxKind.ModuleDeclaration = 129;
    SyntaxKind._map[130] = "ClassDeclaration";
    SyntaxKind.ClassDeclaration = 130;
    SyntaxKind._map[131] = "EnumDeclaration";
    SyntaxKind.EnumDeclaration = 131;
    SyntaxKind._map[132] = "ImportDeclaration";
    SyntaxKind.ImportDeclaration = 132;
    SyntaxKind._map[133] = "MemberFunctionDeclaration";
    SyntaxKind.MemberFunctionDeclaration = 133;
    SyntaxKind._map[134] = "MemberVariableDeclaration";
    SyntaxKind.MemberVariableDeclaration = 134;
    SyntaxKind._map[135] = "ConstructorDeclaration";
    SyntaxKind.ConstructorDeclaration = 135;
    SyntaxKind._map[136] = "GetMemberAccessorDeclaration";
    SyntaxKind.GetMemberAccessorDeclaration = 136;
    SyntaxKind._map[137] = "SetMemberAccessorDeclaration";
    SyntaxKind.SetMemberAccessorDeclaration = 137;
    SyntaxKind._map[138] = "PropertySignature";
    SyntaxKind.PropertySignature = 138;
    SyntaxKind._map[139] = "CallSignature";
    SyntaxKind.CallSignature = 139;
    SyntaxKind._map[140] = "ConstructSignature";
    SyntaxKind.ConstructSignature = 140;
    SyntaxKind._map[141] = "IndexSignature";
    SyntaxKind.IndexSignature = 141;
    SyntaxKind._map[142] = "FunctionSignature";
    SyntaxKind.FunctionSignature = 142;
    SyntaxKind._map[143] = "Block";
    SyntaxKind.Block = 143;
    SyntaxKind._map[144] = "IfStatement";
    SyntaxKind.IfStatement = 144;
    SyntaxKind._map[145] = "VariableStatement";
    SyntaxKind.VariableStatement = 145;
    SyntaxKind._map[146] = "ExpressionStatement";
    SyntaxKind.ExpressionStatement = 146;
    SyntaxKind._map[147] = "ReturnStatement";
    SyntaxKind.ReturnStatement = 147;
    SyntaxKind._map[148] = "SwitchStatement";
    SyntaxKind.SwitchStatement = 148;
    SyntaxKind._map[149] = "BreakStatement";
    SyntaxKind.BreakStatement = 149;
    SyntaxKind._map[150] = "ContinueStatement";
    SyntaxKind.ContinueStatement = 150;
    SyntaxKind._map[151] = "ForStatement";
    SyntaxKind.ForStatement = 151;
    SyntaxKind._map[152] = "ForInStatement";
    SyntaxKind.ForInStatement = 152;
    SyntaxKind._map[153] = "EmptyStatement";
    SyntaxKind.EmptyStatement = 153;
    SyntaxKind._map[154] = "ThrowStatement";
    SyntaxKind.ThrowStatement = 154;
    SyntaxKind._map[155] = "WhileStatement";
    SyntaxKind.WhileStatement = 155;
    SyntaxKind._map[156] = "TryStatement";
    SyntaxKind.TryStatement = 156;
    SyntaxKind._map[157] = "LabeledStatement";
    SyntaxKind.LabeledStatement = 157;
    SyntaxKind._map[158] = "DoStatement";
    SyntaxKind.DoStatement = 158;
    SyntaxKind._map[159] = "DebuggerStatement";
    SyntaxKind.DebuggerStatement = 159;
    SyntaxKind._map[160] = "WithStatement";
    SyntaxKind.WithStatement = 160;
    SyntaxKind._map[161] = "PlusExpression";
    SyntaxKind.PlusExpression = 161;
    SyntaxKind._map[162] = "NegateExpression";
    SyntaxKind.NegateExpression = 162;
    SyntaxKind._map[163] = "BitwiseNotExpression";
    SyntaxKind.BitwiseNotExpression = 163;
    SyntaxKind._map[164] = "LogicalNotExpression";
    SyntaxKind.LogicalNotExpression = 164;
    SyntaxKind._map[165] = "PreIncrementExpression";
    SyntaxKind.PreIncrementExpression = 165;
    SyntaxKind._map[166] = "PreDecrementExpression";
    SyntaxKind.PreDecrementExpression = 166;
    SyntaxKind._map[167] = "DeleteExpression";
    SyntaxKind.DeleteExpression = 167;
    SyntaxKind._map[168] = "TypeOfExpression";
    SyntaxKind.TypeOfExpression = 168;
    SyntaxKind._map[169] = "VoidExpression";
    SyntaxKind.VoidExpression = 169;
    SyntaxKind._map[170] = "CommaExpression";
    SyntaxKind.CommaExpression = 170;
    SyntaxKind._map[171] = "AssignmentExpression";
    SyntaxKind.AssignmentExpression = 171;
    SyntaxKind._map[172] = "AddAssignmentExpression";
    SyntaxKind.AddAssignmentExpression = 172;
    SyntaxKind._map[173] = "SubtractAssignmentExpression";
    SyntaxKind.SubtractAssignmentExpression = 173;
    SyntaxKind._map[174] = "MultiplyAssignmentExpression";
    SyntaxKind.MultiplyAssignmentExpression = 174;
    SyntaxKind._map[175] = "DivideAssignmentExpression";
    SyntaxKind.DivideAssignmentExpression = 175;
    SyntaxKind._map[176] = "ModuloAssignmentExpression";
    SyntaxKind.ModuloAssignmentExpression = 176;
    SyntaxKind._map[177] = "AndAssignmentExpression";
    SyntaxKind.AndAssignmentExpression = 177;
    SyntaxKind._map[178] = "ExclusiveOrAssignmentExpression";
    SyntaxKind.ExclusiveOrAssignmentExpression = 178;
    SyntaxKind._map[179] = "OrAssignmentExpression";
    SyntaxKind.OrAssignmentExpression = 179;
    SyntaxKind._map[180] = "LeftShiftAssignmentExpression";
    SyntaxKind.LeftShiftAssignmentExpression = 180;
    SyntaxKind._map[181] = "SignedRightShiftAssignmentExpression";
    SyntaxKind.SignedRightShiftAssignmentExpression = 181;
    SyntaxKind._map[182] = "UnsignedRightShiftAssignmentExpression";
    SyntaxKind.UnsignedRightShiftAssignmentExpression = 182;
    SyntaxKind._map[183] = "ConditionalExpression";
    SyntaxKind.ConditionalExpression = 183;
    SyntaxKind._map[184] = "LogicalOrExpression";
    SyntaxKind.LogicalOrExpression = 184;
    SyntaxKind._map[185] = "LogicalAndExpression";
    SyntaxKind.LogicalAndExpression = 185;
    SyntaxKind._map[186] = "BitwiseOrExpression";
    SyntaxKind.BitwiseOrExpression = 186;
    SyntaxKind._map[187] = "BitwiseExclusiveOrExpression";
    SyntaxKind.BitwiseExclusiveOrExpression = 187;
    SyntaxKind._map[188] = "BitwiseAndExpression";
    SyntaxKind.BitwiseAndExpression = 188;
    SyntaxKind._map[189] = "EqualsWithTypeConversionExpression";
    SyntaxKind.EqualsWithTypeConversionExpression = 189;
    SyntaxKind._map[190] = "NotEqualsWithTypeConversionExpression";
    SyntaxKind.NotEqualsWithTypeConversionExpression = 190;
    SyntaxKind._map[191] = "EqualsExpression";
    SyntaxKind.EqualsExpression = 191;
    SyntaxKind._map[192] = "NotEqualsExpression";
    SyntaxKind.NotEqualsExpression = 192;
    SyntaxKind._map[193] = "LessThanExpression";
    SyntaxKind.LessThanExpression = 193;
    SyntaxKind._map[194] = "GreaterThanExpression";
    SyntaxKind.GreaterThanExpression = 194;
    SyntaxKind._map[195] = "LessThanOrEqualExpression";
    SyntaxKind.LessThanOrEqualExpression = 195;
    SyntaxKind._map[196] = "GreaterThanOrEqualExpression";
    SyntaxKind.GreaterThanOrEqualExpression = 196;
    SyntaxKind._map[197] = "InstanceOfExpression";
    SyntaxKind.InstanceOfExpression = 197;
    SyntaxKind._map[198] = "InExpression";
    SyntaxKind.InExpression = 198;
    SyntaxKind._map[199] = "LeftShiftExpression";
    SyntaxKind.LeftShiftExpression = 199;
    SyntaxKind._map[200] = "SignedRightShiftExpression";
    SyntaxKind.SignedRightShiftExpression = 200;
    SyntaxKind._map[201] = "UnsignedRightShiftExpression";
    SyntaxKind.UnsignedRightShiftExpression = 201;
    SyntaxKind._map[202] = "MultiplyExpression";
    SyntaxKind.MultiplyExpression = 202;
    SyntaxKind._map[203] = "DivideExpression";
    SyntaxKind.DivideExpression = 203;
    SyntaxKind._map[204] = "ModuloExpression";
    SyntaxKind.ModuloExpression = 204;
    SyntaxKind._map[205] = "AddExpression";
    SyntaxKind.AddExpression = 205;
    SyntaxKind._map[206] = "SubtractExpression";
    SyntaxKind.SubtractExpression = 206;
    SyntaxKind._map[207] = "PostIncrementExpression";
    SyntaxKind.PostIncrementExpression = 207;
    SyntaxKind._map[208] = "PostDecrementExpression";
    SyntaxKind.PostDecrementExpression = 208;
    SyntaxKind._map[209] = "MemberAccessExpression";
    SyntaxKind.MemberAccessExpression = 209;
    SyntaxKind._map[210] = "InvocationExpression";
    SyntaxKind.InvocationExpression = 210;
    SyntaxKind._map[211] = "ArrayLiteralExpression";
    SyntaxKind.ArrayLiteralExpression = 211;
    SyntaxKind._map[212] = "ObjectLiteralExpression";
    SyntaxKind.ObjectLiteralExpression = 212;
    SyntaxKind._map[213] = "ObjectCreationExpression";
    SyntaxKind.ObjectCreationExpression = 213;
    SyntaxKind._map[214] = "ParenthesizedExpression";
    SyntaxKind.ParenthesizedExpression = 214;
    SyntaxKind._map[215] = "ParenthesizedArrowFunctionExpression";
    SyntaxKind.ParenthesizedArrowFunctionExpression = 215;
    SyntaxKind._map[216] = "SimpleArrowFunctionExpression";
    SyntaxKind.SimpleArrowFunctionExpression = 216;
    SyntaxKind._map[217] = "CastExpression";
    SyntaxKind.CastExpression = 217;
    SyntaxKind._map[218] = "ElementAccessExpression";
    SyntaxKind.ElementAccessExpression = 218;
    SyntaxKind._map[219] = "FunctionExpression";
    SyntaxKind.FunctionExpression = 219;
    SyntaxKind._map[220] = "OmittedExpression";
    SyntaxKind.OmittedExpression = 220;
    SyntaxKind._map[221] = "VariableDeclaration";
    SyntaxKind.VariableDeclaration = 221;
    SyntaxKind._map[222] = "VariableDeclarator";
    SyntaxKind.VariableDeclarator = 222;
    SyntaxKind._map[223] = "ArgumentList";
    SyntaxKind.ArgumentList = 223;
    SyntaxKind._map[224] = "ParameterList";
    SyntaxKind.ParameterList = 224;
    SyntaxKind._map[225] = "TypeArgumentList";
    SyntaxKind.TypeArgumentList = 225;
    SyntaxKind._map[226] = "TypeParameterList";
    SyntaxKind.TypeParameterList = 226;
    SyntaxKind._map[227] = "ImplementsClause";
    SyntaxKind.ImplementsClause = 227;
    SyntaxKind._map[228] = "ExtendsClause";
    SyntaxKind.ExtendsClause = 228;
    SyntaxKind._map[229] = "EqualsValueClause";
    SyntaxKind.EqualsValueClause = 229;
    SyntaxKind._map[230] = "CaseSwitchClause";
    SyntaxKind.CaseSwitchClause = 230;
    SyntaxKind._map[231] = "DefaultSwitchClause";
    SyntaxKind.DefaultSwitchClause = 231;
    SyntaxKind._map[232] = "ElseClause";
    SyntaxKind.ElseClause = 232;
    SyntaxKind._map[233] = "CatchClause";
    SyntaxKind.CatchClause = 233;
    SyntaxKind._map[234] = "FinallyClause";
    SyntaxKind.FinallyClause = 234;
    SyntaxKind._map[235] = "TypeParameter";
    SyntaxKind.TypeParameter = 235;
    SyntaxKind._map[236] = "Constraint";
    SyntaxKind.Constraint = 236;
    SyntaxKind._map[237] = "Parameter";
    SyntaxKind.Parameter = 237;
    SyntaxKind._map[238] = "TypeAnnotation";
    SyntaxKind.TypeAnnotation = 238;
    SyntaxKind._map[239] = "SimplePropertyAssignment";
    SyntaxKind.SimplePropertyAssignment = 239;
    SyntaxKind._map[240] = "ExternalModuleReference";
    SyntaxKind.ExternalModuleReference = 240;
    SyntaxKind._map[241] = "ModuleNameModuleReference";
    SyntaxKind.ModuleNameModuleReference = 241;
    SyntaxKind._map[242] = "GetAccessorPropertyAssignment";
    SyntaxKind.GetAccessorPropertyAssignment = 242;
    SyntaxKind._map[243] = "SetAccessorPropertyAssignment";
    SyntaxKind.SetAccessorPropertyAssignment = 243;
    SyntaxKind.FirstStandardKeyword = SyntaxKind.BreakKeyword;
    SyntaxKind.LastStandardKeyword = SyntaxKind.WithKeyword;
    SyntaxKind.FirstFutureReservedKeyword = SyntaxKind.ClassKeyword;
    SyntaxKind.LastFutureReservedKeyword = SyntaxKind.SuperKeyword;
    SyntaxKind.FirstFutureReservedStrictKeyword = SyntaxKind.ImplementsKeyword;
    SyntaxKind.LastFutureReservedStrictKeyword = SyntaxKind.YieldKeyword;
    SyntaxKind.FirstTypeScriptKeyword = SyntaxKind.AnyKeyword;
    SyntaxKind.LastTypeScriptKeyword = SyntaxKind.StringKeyword;
    SyntaxKind.FirstKeyword = SyntaxKind.FirstStandardKeyword;
    SyntaxKind.LastKeyword = SyntaxKind.LastTypeScriptKeyword;
    SyntaxKind.FirstToken = SyntaxKind.ErrorToken;
    SyntaxKind.LastToken = SyntaxKind.SlashEqualsToken;
    SyntaxKind.FirstPunctuation = SyntaxKind.OpenBraceToken;
    SyntaxKind.LastPunctuation = SyntaxKind.SlashEqualsToken;
    SyntaxKind.FirstFixedWidth = SyntaxKind.FirstKeyword;
    SyntaxKind.LastFixedWidth = SyntaxKind.LastPunctuation;
})(SyntaxKind || (SyntaxKind = {}));
var IntegerUtilities = (function () {
    function IntegerUtilities() { }
    IntegerUtilities.integerDivide = function integerDivide(numerator, denominator) {
        return (numerator / denominator) >> 0;
    };
    IntegerUtilities.integerMultiplyLow32Bits = function integerMultiplyLow32Bits(n1, n2) {
        var n1Low16 = n1 & 65535;
        var n1High16 = n1 >>> 16;
        var n2Low16 = n2 & 65535;
        var n2High16 = n2 >>> 16;
        var resultLow32 = (((n1 & 4294901760) * n2) >>> 0) + (((n1 & 65535) * n2) >>> 0) >>> 0;
        return resultLow32;
    };
    IntegerUtilities.integerMultiplyHigh32Bits = function integerMultiplyHigh32Bits(n1, n2) {
        var n1Low16 = n1 & 65535;
        var n1High16 = n1 >>> 16;
        var n2Low16 = n2 & 65535;
        var n2High16 = n2 >>> 16;
        var resultHigh32 = n1High16 * n2High16 + ((((n1Low16 * n2Low16) >>> 17) + n1Low16 * n2High16) >>> 15);
        return resultHigh32;
    };
    return IntegerUtilities;
})();
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PositionedElement = (function () {
    function PositionedElement(parent, element, fullStart) {
        this._parent = parent;
        this._element = element;
        this._fullStart = fullStart;
    }
    PositionedElement.create = function create(parent, element, fullStart) {
        if(element === null) {
            return null;
        }
        if(element.isNode()) {
            return new PositionedNode(parent, element, fullStart);
        } else if(element.isToken()) {
            return new PositionedToken(parent, element, fullStart);
        } else if(element.isList()) {
            return new PositionedList(parent, element, fullStart);
        } else if(element.isSeparatedList()) {
            return new PositionedSeparatedList(parent, element, fullStart);
        } else {
            throw Errors.invalidOperation();
        }
    };
    PositionedElement.prototype.parent = function () {
        return this._parent;
    };
    PositionedElement.prototype.parentElement = function () {
        return this._parent && this._parent._element;
    };
    PositionedElement.prototype.element = function () {
        return this._element;
    };
    PositionedElement.prototype.kind = function () {
        return this.element().kind();
    };
    PositionedElement.prototype.childCount = function () {
        return this.element().childCount();
    };
    PositionedElement.prototype.childAt = function (index) {
        var offset = 0;
        for(var i = 0; i < index; i++) {
            offset += this.element().childAt(i).fullWidth();
        }
        return PositionedElement.create(this, this.element().childAt(index), offset);
    };
    PositionedElement.prototype.getPositionedChild = function (child) {
        var offset = Syntax.childOffset(this.element(), child);
        return PositionedElement.create(this, child, offset);
    };
    PositionedElement.prototype.fullStart = function () {
        return this._fullStart;
    };
    PositionedElement.prototype.fullEnd = function () {
        return this.fullStart() + this.element().fullWidth();
    };
    PositionedElement.prototype.fullWidth = function () {
        return this.element().fullWidth();
    };
    PositionedElement.prototype.start = function () {
        return this.fullStart() + this.element().leadingTriviaWidth();
    };
    PositionedElement.prototype.end = function () {
        return this.fullStart() + this.element().leadingTriviaWidth() + this.element().width();
    };
    PositionedElement.prototype.root = function () {
        var current = this;
        while(current.parent() !== null) {
            current = current.parent();
        }
        return current;
    };
    PositionedElement.prototype.containingNode = function () {
        var current = this.parent();
        while(current !== null && !current.element().isNode()) {
            current = current.parent();
        }
        return current;
    };
    return PositionedElement;
})();
var PositionedNodeOrToken = (function (_super) {
    __extends(PositionedNodeOrToken, _super);
    function PositionedNodeOrToken(parent, nodeOrToken, fullStart) {
        _super.call(this, parent, nodeOrToken, fullStart);
    }
    PositionedNodeOrToken.prototype.nodeOrToken = function () {
        return this.element();
    };
    return PositionedNodeOrToken;
})(PositionedElement);
var PositionedNode = (function (_super) {
    __extends(PositionedNode, _super);
    function PositionedNode(parent, node, fullStart) {
        _super.call(this, parent, node, fullStart);
    }
    PositionedNode.prototype.node = function () {
        return this.element();
    };
    return PositionedNode;
})(PositionedNodeOrToken);
var PositionedToken = (function (_super) {
    __extends(PositionedToken, _super);
    function PositionedToken(parent, token, fullStart) {
        _super.call(this, parent, token, fullStart);
    }
    PositionedToken.prototype.token = function () {
        return this.element();
    };
    PositionedToken.prototype.previousToken = function () {
        var fullStart = this.fullStart();
        if(fullStart === 0) {
            return null;
        }
        return this.root().node().findToken(fullStart - 1);
    };
    PositionedToken.prototype.nextToken = function () {
        if(this.token().tokenKind === 10 /* EndOfFileToken */ ) {
            return null;
        }
        return this.root().node().findToken(this.fullEnd());
    };
    return PositionedToken;
})(PositionedNodeOrToken);
var PositionedList = (function (_super) {
    __extends(PositionedList, _super);
    function PositionedList(parent, list, fullStart) {
        _super.call(this, parent, list, fullStart);
    }
    PositionedList.prototype.list = function () {
        return this.element();
    };
    return PositionedList;
})(PositionedElement);
var PositionedSeparatedList = (function (_super) {
    __extends(PositionedSeparatedList, _super);
    function PositionedSeparatedList(parent, list, fullStart) {
        _super.call(this, parent, list, fullStart);
    }
    PositionedSeparatedList.prototype.list = function () {
        return this.element();
    };
    return PositionedSeparatedList;
})(PositionedElement);
var Debug = (function () {
    function Debug() { }
    Debug.assert = function assert(expression) {
        if(!expression) {
            throw new Error("Debug Failure. False expression.");
        }
    };
    return Debug;
})();
var SyntaxFacts;
(function (SyntaxFacts) {
    var textToKeywordKind = {
        "any": 60 /* AnyKeyword */ ,
        "bool": 62 /* BoolKeyword */ ,
        "boolean": 61 /* BooleanKeyword */ ,
        "break": 15 /* BreakKeyword */ ,
        "case": 16 /* CaseKeyword */ ,
        "catch": 17 /* CatchKeyword */ ,
        "class": 44 /* ClassKeyword */ ,
        "continue": 18 /* ContinueKeyword */ ,
        "const": 45 /* ConstKeyword */ ,
        "constructor": 63 /* ConstructorKeyword */ ,
        "debugger": 19 /* DebuggerKeyword */ ,
        "declare": 64 /* DeclareKeyword */ ,
        "default": 20 /* DefaultKeyword */ ,
        "delete": 21 /* DeleteKeyword */ ,
        "do": 22 /* DoKeyword */ ,
        "else": 23 /* ElseKeyword */ ,
        "enum": 46 /* EnumKeyword */ ,
        "export": 47 /* ExportKeyword */ ,
        "extends": 48 /* ExtendsKeyword */ ,
        "false": 24 /* FalseKeyword */ ,
        "finally": 25 /* FinallyKeyword */ ,
        "for": 26 /* ForKeyword */ ,
        "function": 27 /* FunctionKeyword */ ,
        "get": 65 /* GetKeyword */ ,
        "if": 28 /* IfKeyword */ ,
        "implements": 51 /* ImplementsKeyword */ ,
        "import": 49 /* ImportKeyword */ ,
        "in": 29 /* InKeyword */ ,
        "instanceof": 30 /* InstanceOfKeyword */ ,
        "interface": 52 /* InterfaceKeyword */ ,
        "let": 53 /* LetKeyword */ ,
        "module": 66 /* ModuleKeyword */ ,
        "new": 31 /* NewKeyword */ ,
        "null": 32 /* NullKeyword */ ,
        "number": 67 /* NumberKeyword */ ,
        "package": 54 /* PackageKeyword */ ,
        "private": 55 /* PrivateKeyword */ ,
        "protected": 56 /* ProtectedKeyword */ ,
        "public": 57 /* PublicKeyword */ ,
        "return": 33 /* ReturnKeyword */ ,
        "set": 68 /* SetKeyword */ ,
        "static": 58 /* StaticKeyword */ ,
        "string": 69 /* StringKeyword */ ,
        "super": 50 /* SuperKeyword */ ,
        "switch": 34 /* SwitchKeyword */ ,
        "this": 35 /* ThisKeyword */ ,
        "throw": 36 /* ThrowKeyword */ ,
        "true": 37 /* TrueKeyword */ ,
        "try": 38 /* TryKeyword */ ,
        "typeof": 39 /* TypeOfKeyword */ ,
        "var": 40 /* VarKeyword */ ,
        "void": 41 /* VoidKeyword */ ,
        "while": 42 /* WhileKeyword */ ,
        "with": 43 /* WithKeyword */ ,
        "yield": 59 /* YieldKeyword */ ,
        "{": 70 /* OpenBraceToken */ ,
        "}": 71 /* CloseBraceToken */ ,
        "(": 72 /* OpenParenToken */ ,
        ")": 73 /* CloseParenToken */ ,
        "[": 74 /* OpenBracketToken */ ,
        "]": 75 /* CloseBracketToken */ ,
        ".": 76 /* DotToken */ ,
        "...": 77 /* DotDotDotToken */ ,
        ";": 78 /* SemicolonToken */ ,
        ",": 79 /* CommaToken */ ,
        "<": 80 /* LessThanToken */ ,
        ">": 81 /* GreaterThanToken */ ,
        "<=": 82 /* LessThanEqualsToken */ ,
        ">=": 83 /* GreaterThanEqualsToken */ ,
        "==": 84 /* EqualsEqualsToken */ ,
        "=>": 85 /* EqualsGreaterThanToken */ ,
        "!=": 86 /* ExclamationEqualsToken */ ,
        "===": 87 /* EqualsEqualsEqualsToken */ ,
        "!==": 88 /* ExclamationEqualsEqualsToken */ ,
        "+": 89 /* PlusToken */ ,
        "-": 90 /* MinusToken */ ,
        "*": 91 /* AsteriskToken */ ,
        "%": 92 /* PercentToken */ ,
        "++": 93 /* PlusPlusToken */ ,
        "--": 94 /* MinusMinusToken */ ,
        "<<": 95 /* LessThanLessThanToken */ ,
        ">>": 96 /* GreaterThanGreaterThanToken */ ,
        ">>>": 97 /* GreaterThanGreaterThanGreaterThanToken */ ,
        "&": 98 /* AmpersandToken */ ,
        "|": 99 /* BarToken */ ,
        "^": 100 /* CaretToken */ ,
        "!": 101 /* ExclamationToken */ ,
        "~": 102 /* TildeToken */ ,
        "&&": 103 /* AmpersandAmpersandToken */ ,
        "||": 104 /* BarBarToken */ ,
        "?": 105 /* QuestionToken */ ,
        ":": 106 /* ColonToken */ ,
        "=": 107 /* EqualsToken */ ,
        "+=": 108 /* PlusEqualsToken */ ,
        "-=": 109 /* MinusEqualsToken */ ,
        "*=": 110 /* AsteriskEqualsToken */ ,
        "%=": 111 /* PercentEqualsToken */ ,
        "<<=": 112 /* LessThanLessThanEqualsToken */ ,
        ">>=": 113 /* GreaterThanGreaterThanEqualsToken */ ,
        ">>>=": 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */ ,
        "&=": 115 /* AmpersandEqualsToken */ ,
        "|=": 116 /* BarEqualsToken */ ,
        "^=": 117 /* CaretEqualsToken */ ,
        "/": 118 /* SlashToken */ ,
        "/=": 119 /* SlashEqualsToken */ 
    };
    var kindToText = [];
    for(var name in textToKeywordKind) {
        if(textToKeywordKind.hasOwnProperty(name)) {
            Debug.assert(kindToText[textToKeywordKind[name]] === undefined);
            kindToText[textToKeywordKind[name]] = name;
        }
    }
    kindToText[63 /* ConstructorKeyword */ ] = "constructor";
    function getTokenKind(text) {
        if(textToKeywordKind.hasOwnProperty(text)) {
            return textToKeywordKind[text];
        }
        return 0 /* None */ ;
    }
    SyntaxFacts.getTokenKind = getTokenKind;
    function getText(kind) {
        var result = kindToText[kind];
        return result !== undefined ? result : null;
    }
    SyntaxFacts.getText = getText;
    function isTokenKind(kind) {
        return kind >= 9 /* FirstToken */  && kind <= 119 /* LastToken */ ;
    }
    SyntaxFacts.isTokenKind = isTokenKind;
    function isAnyKeyword(kind) {
        return kind >= 15 /* FirstKeyword */  && kind <= 69 /* LastKeyword */ ;
    }
    SyntaxFacts.isAnyKeyword = isAnyKeyword;
    function isStandardKeyword(kind) {
        return kind >= 15 /* FirstStandardKeyword */  && kind <= 43 /* LastStandardKeyword */ ;
    }
    SyntaxFacts.isStandardKeyword = isStandardKeyword;
    function isFutureReservedKeyword(kind) {
        return kind >= 44 /* FirstFutureReservedKeyword */  && kind <= 50 /* LastFutureReservedKeyword */ ;
    }
    SyntaxFacts.isFutureReservedKeyword = isFutureReservedKeyword;
    function isFutureReservedStrictKeyword(kind) {
        return kind >= 51 /* FirstFutureReservedStrictKeyword */  && kind <= 59 /* LastFutureReservedStrictKeyword */ ;
    }
    SyntaxFacts.isFutureReservedStrictKeyword = isFutureReservedStrictKeyword;
    function isAnyPunctuation(kind) {
        return kind >= 70 /* FirstPunctuation */  && kind <= 119 /* LastPunctuation */ ;
    }
    SyntaxFacts.isAnyPunctuation = isAnyPunctuation;
    function isPrefixUnaryExpressionOperatorToken(tokenKind) {
        return getPrefixUnaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */ ;
    }
    SyntaxFacts.isPrefixUnaryExpressionOperatorToken = isPrefixUnaryExpressionOperatorToken;
    function isBinaryExpressionOperatorToken(tokenKind) {
        return getBinaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */ ;
    }
    SyntaxFacts.isBinaryExpressionOperatorToken = isBinaryExpressionOperatorToken;
    function getPrefixUnaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 89 /* PlusToken */ :
                return 161 /* PlusExpression */ ;
            case 90 /* MinusToken */ :
                return 162 /* NegateExpression */ ;
            case 102 /* TildeToken */ :
                return 163 /* BitwiseNotExpression */ ;
            case 101 /* ExclamationToken */ :
                return 164 /* LogicalNotExpression */ ;
            case 93 /* PlusPlusToken */ :
                return 165 /* PreIncrementExpression */ ;
            case 94 /* MinusMinusToken */ :
                return 166 /* PreDecrementExpression */ ;
            default:
                return 0 /* None */ ;
        }
    }
    SyntaxFacts.getPrefixUnaryExpressionFromOperatorToken = getPrefixUnaryExpressionFromOperatorToken;
    function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 93 /* PlusPlusToken */ :
                return 207 /* PostIncrementExpression */ ;
            case 94 /* MinusMinusToken */ :
                return 208 /* PostDecrementExpression */ ;
            default:
                return 0 /* None */ ;
        }
    }
    SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = getPostfixUnaryExpressionFromOperatorToken;
    function getBinaryExpressionFromOperatorToken(tokenKind) {
        switch(tokenKind) {
            case 91 /* AsteriskToken */ :
                return 202 /* MultiplyExpression */ ;
            case 118 /* SlashToken */ :
                return 203 /* DivideExpression */ ;
            case 92 /* PercentToken */ :
                return 204 /* ModuloExpression */ ;
            case 89 /* PlusToken */ :
                return 205 /* AddExpression */ ;
            case 90 /* MinusToken */ :
                return 206 /* SubtractExpression */ ;
            case 95 /* LessThanLessThanToken */ :
                return 199 /* LeftShiftExpression */ ;
            case 96 /* GreaterThanGreaterThanToken */ :
                return 200 /* SignedRightShiftExpression */ ;
            case 97 /* GreaterThanGreaterThanGreaterThanToken */ :
                return 201 /* UnsignedRightShiftExpression */ ;
            case 80 /* LessThanToken */ :
                return 193 /* LessThanExpression */ ;
            case 81 /* GreaterThanToken */ :
                return 194 /* GreaterThanExpression */ ;
            case 82 /* LessThanEqualsToken */ :
                return 195 /* LessThanOrEqualExpression */ ;
            case 83 /* GreaterThanEqualsToken */ :
                return 196 /* GreaterThanOrEqualExpression */ ;
            case 30 /* InstanceOfKeyword */ :
                return 197 /* InstanceOfExpression */ ;
            case 29 /* InKeyword */ :
                return 198 /* InExpression */ ;
            case 84 /* EqualsEqualsToken */ :
                return 189 /* EqualsWithTypeConversionExpression */ ;
            case 86 /* ExclamationEqualsToken */ :
                return 190 /* NotEqualsWithTypeConversionExpression */ ;
            case 87 /* EqualsEqualsEqualsToken */ :
                return 191 /* EqualsExpression */ ;
            case 88 /* ExclamationEqualsEqualsToken */ :
                return 192 /* NotEqualsExpression */ ;
            case 98 /* AmpersandToken */ :
                return 188 /* BitwiseAndExpression */ ;
            case 100 /* CaretToken */ :
                return 187 /* BitwiseExclusiveOrExpression */ ;
            case 99 /* BarToken */ :
                return 186 /* BitwiseOrExpression */ ;
            case 103 /* AmpersandAmpersandToken */ :
                return 185 /* LogicalAndExpression */ ;
            case 104 /* BarBarToken */ :
                return 184 /* LogicalOrExpression */ ;
            case 116 /* BarEqualsToken */ :
                return 179 /* OrAssignmentExpression */ ;
            case 115 /* AmpersandEqualsToken */ :
                return 177 /* AndAssignmentExpression */ ;
            case 117 /* CaretEqualsToken */ :
                return 178 /* ExclusiveOrAssignmentExpression */ ;
            case 112 /* LessThanLessThanEqualsToken */ :
                return 180 /* LeftShiftAssignmentExpression */ ;
            case 113 /* GreaterThanGreaterThanEqualsToken */ :
                return 181 /* SignedRightShiftAssignmentExpression */ ;
            case 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */ :
                return 182 /* UnsignedRightShiftAssignmentExpression */ ;
            case 108 /* PlusEqualsToken */ :
                return 172 /* AddAssignmentExpression */ ;
            case 109 /* MinusEqualsToken */ :
                return 173 /* SubtractAssignmentExpression */ ;
            case 110 /* AsteriskEqualsToken */ :
                return 174 /* MultiplyAssignmentExpression */ ;
            case 119 /* SlashEqualsToken */ :
                return 175 /* DivideAssignmentExpression */ ;
            case 111 /* PercentEqualsToken */ :
                return 176 /* ModuloAssignmentExpression */ ;
            case 107 /* EqualsToken */ :
                return 171 /* AssignmentExpression */ ;
            case 79 /* CommaToken */ :
                return 170 /* CommaExpression */ ;
            default:
                return 0 /* None */ ;
        }
    }
    SyntaxFacts.getBinaryExpressionFromOperatorToken = getBinaryExpressionFromOperatorToken;
    function isAnyDivideToken(kind) {
        switch(kind) {
            case 118 /* SlashToken */ :
            case 119 /* SlashEqualsToken */ :
                return true;
            default:
                return false;
        }
    }
    SyntaxFacts.isAnyDivideToken = isAnyDivideToken;
    function isAnyDivideOrRegularExpressionToken(kind) {
        switch(kind) {
            case 118 /* SlashToken */ :
            case 119 /* SlashEqualsToken */ :
            case 12 /* RegularExpressionLiteral */ :
                return true;
            default:
                return false;
        }
    }
    SyntaxFacts.isAnyDivideOrRegularExpressionToken = isAnyDivideOrRegularExpressionToken;
    function isParserGenerated(kind) {
        switch(kind) {
            case 96 /* GreaterThanGreaterThanToken */ :
            case 97 /* GreaterThanGreaterThanGreaterThanToken */ :
            case 83 /* GreaterThanEqualsToken */ :
            case 113 /* GreaterThanGreaterThanEqualsToken */ :
            case 114 /* GreaterThanGreaterThanGreaterThanEqualsToken */ :
                return true;
            default:
                return false;
        }
    }
    SyntaxFacts.isParserGenerated = isParserGenerated;
    function isIdentifierName(kind) {
        return kind === 11 /* IdentifierName */  || isAnyKeyword(kind);
    }
    SyntaxFacts.isIdentifierName = isIdentifierName;
    function isAnyBinaryExpression(kind) {
        switch(kind) {
            case 170 /* CommaExpression */ :
            case 171 /* AssignmentExpression */ :
            case 172 /* AddAssignmentExpression */ :
            case 173 /* SubtractAssignmentExpression */ :
            case 174 /* MultiplyAssignmentExpression */ :
            case 175 /* DivideAssignmentExpression */ :
            case 176 /* ModuloAssignmentExpression */ :
            case 177 /* AndAssignmentExpression */ :
            case 178 /* ExclusiveOrAssignmentExpression */ :
            case 179 /* OrAssignmentExpression */ :
            case 180 /* LeftShiftAssignmentExpression */ :
            case 181 /* SignedRightShiftAssignmentExpression */ :
            case 182 /* UnsignedRightShiftAssignmentExpression */ :
            case 184 /* LogicalOrExpression */ :
            case 185 /* LogicalAndExpression */ :
            case 186 /* BitwiseOrExpression */ :
            case 187 /* BitwiseExclusiveOrExpression */ :
            case 188 /* BitwiseAndExpression */ :
            case 189 /* EqualsWithTypeConversionExpression */ :
            case 190 /* NotEqualsWithTypeConversionExpression */ :
            case 191 /* EqualsExpression */ :
            case 192 /* NotEqualsExpression */ :
            case 193 /* LessThanExpression */ :
            case 194 /* GreaterThanExpression */ :
            case 195 /* LessThanOrEqualExpression */ :
            case 196 /* GreaterThanOrEqualExpression */ :
            case 197 /* InstanceOfExpression */ :
            case 198 /* InExpression */ :
            case 199 /* LeftShiftExpression */ :
            case 200 /* SignedRightShiftExpression */ :
            case 201 /* UnsignedRightShiftExpression */ :
            case 202 /* MultiplyExpression */ :
            case 203 /* DivideExpression */ :
            case 204 /* ModuloExpression */ :
            case 205 /* AddExpression */ :
            case 206 /* SubtractExpression */ :
                return true;
        }
        return false;
    }
    SyntaxFacts.isAnyBinaryExpression = isAnyBinaryExpression;
})(SyntaxFacts || (SyntaxFacts = {}));
var Syntax;
(function (Syntax) {
    Syntax.emptySeparatedList = {
        kind: function () {
            return 2 /* SeparatedList */ ;
        },
        isNode: function () {
            return false;
        },
        isToken: function () {
            return false;
        },
        isList: function () {
            return false;
        },
        isSeparatedList: function () {
            return true;
        },
        toJSON: function (key) {
            return [];
        },
        childCount: function () {
            return 0;
        },
        nonSeparatorCount: function () {
            return 0;
        },
        separatorCount: function () {
            return 0;
        },
        toArray: function () {
            return [];
        },
        toNonSeparatorArray: function () {
            return [];
        },
        childAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        },
        nonSeparatorAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        },
        separatorAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        },
        collectTextElements: function (elements) {
        },
        firstToken: function () {
            return null;
        },
        lastToken: function () {
            return null;
        },
        fullWidth: function () {
            return 0;
        },
        fullText: function () {
            return "";
        },
        width: function () {
            return 0;
        },
        isTypeScriptSpecific: function () {
            return false;
        },
        hasSkippedText: function () {
            return false;
        },
        hasZeroWidthToken: function () {
            return false;
        },
        hasRegularExpressionToken: function () {
            return false;
        },
        findTokenInternal: function (parent, position, fullStart) {
            throw Errors.invalidOperation();
        },
        insertChildrenInto: function (array, index) {
        },
        leadingTrivia: function () {
            return Syntax.emptyTriviaList;
        },
        trailingTrivia: function () {
            return Syntax.emptyTriviaList;
        },
        leadingTriviaWidth: function () {
            return 0;
        },
        trailingTriviaWidth: function () {
            return 0;
        }
    };
    var SingletonSeparatedSyntaxList = (function () {
        function SingletonSeparatedSyntaxList(item) {
            this.item = item;
        }
        SingletonSeparatedSyntaxList.prototype.toJSON = function (key) {
            return [
                this.item
            ];
        };
        SingletonSeparatedSyntaxList.prototype.kind = function () {
            return 2 /* SeparatedList */ ;
        };
        SingletonSeparatedSyntaxList.prototype.isNode = function () {
            return false;
        };
        SingletonSeparatedSyntaxList.prototype.isToken = function () {
            return false;
        };
        SingletonSeparatedSyntaxList.prototype.isList = function () {
            return false;
        };
        SingletonSeparatedSyntaxList.prototype.isSeparatedList = function () {
            return true;
        };
        SingletonSeparatedSyntaxList.prototype.childCount = function () {
            return 1;
        };
        SingletonSeparatedSyntaxList.prototype.nonSeparatorCount = function () {
            return 1;
        };
        SingletonSeparatedSyntaxList.prototype.separatorCount = function () {
            return 0;
        };
        SingletonSeparatedSyntaxList.prototype.toArray = function () {
            return [
                this.item
            ];
        };
        SingletonSeparatedSyntaxList.prototype.toNonSeparatorArray = function () {
            return [
                this.item
            ];
        };
        SingletonSeparatedSyntaxList.prototype.childAt = function (index) {
            if(index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.item;
        };
        SingletonSeparatedSyntaxList.prototype.nonSeparatorAt = function (index) {
            if(index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.item;
        };
        SingletonSeparatedSyntaxList.prototype.separatorAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        SingletonSeparatedSyntaxList.prototype.collectTextElements = function (elements) {
            this.item.collectTextElements(elements);
        };
        SingletonSeparatedSyntaxList.prototype.firstToken = function () {
            return this.item.firstToken();
        };
        SingletonSeparatedSyntaxList.prototype.lastToken = function () {
            return this.item.lastToken();
        };
        SingletonSeparatedSyntaxList.prototype.fullWidth = function () {
            return this.item.fullWidth();
        };
        SingletonSeparatedSyntaxList.prototype.width = function () {
            return this.item.width();
        };
        SingletonSeparatedSyntaxList.prototype.fullText = function () {
            return this.item.fullText();
        };
        SingletonSeparatedSyntaxList.prototype.leadingTrivia = function () {
            return this.item.leadingTrivia();
        };
        SingletonSeparatedSyntaxList.prototype.trailingTrivia = function () {
            return this.item.trailingTrivia();
        };
        SingletonSeparatedSyntaxList.prototype.leadingTriviaWidth = function () {
            return this.item.leadingTriviaWidth();
        };
        SingletonSeparatedSyntaxList.prototype.trailingTriviaWidth = function () {
            return this.item.trailingTriviaWidth();
        };
        SingletonSeparatedSyntaxList.prototype.isTypeScriptSpecific = function () {
            return this.item.isTypeScriptSpecific();
        };
        SingletonSeparatedSyntaxList.prototype.hasSkippedText = function () {
            return this.item.hasSkippedText();
        };
        SingletonSeparatedSyntaxList.prototype.hasZeroWidthToken = function () {
            return this.item.hasZeroWidthToken();
        };
        SingletonSeparatedSyntaxList.prototype.hasRegularExpressionToken = function () {
            return this.item.hasRegularExpressionToken();
        };
        SingletonSeparatedSyntaxList.prototype.findTokenInternal = function (parent, position, fullStart) {
            Debug.assert(position >= 0 && position < this.item.fullWidth());
            return (this.item).findTokenInternal(new PositionedSeparatedList(parent, this, fullStart), position, fullStart);
        };
        SingletonSeparatedSyntaxList.prototype.insertChildrenInto = function (array, index) {
            array.splice(index, 0, this.item);
        };
        return SingletonSeparatedSyntaxList;
    })();    
    var NormalSeparatedSyntaxList = (function () {
        function NormalSeparatedSyntaxList(elements) {
            this._data = -1;
            this.elements = elements;
        }
        NormalSeparatedSyntaxList.prototype.kind = function () {
            return 2 /* SeparatedList */ ;
        };
        NormalSeparatedSyntaxList.prototype.isToken = function () {
            return false;
        };
        NormalSeparatedSyntaxList.prototype.isNode = function () {
            return false;
        };
        NormalSeparatedSyntaxList.prototype.isList = function () {
            return false;
        };
        NormalSeparatedSyntaxList.prototype.isSeparatedList = function () {
            return true;
        };
        NormalSeparatedSyntaxList.prototype.toJSON = function (key) {
            return this.elements;
        };
        NormalSeparatedSyntaxList.prototype.childCount = function () {
            return this.elements.length;
        };
        NormalSeparatedSyntaxList.prototype.nonSeparatorCount = function () {
            return IntegerUtilities.integerDivide(this.elements.length + 1, 2);
        };
        NormalSeparatedSyntaxList.prototype.separatorCount = function () {
            return IntegerUtilities.integerDivide(this.elements.length, 2);
        };
        NormalSeparatedSyntaxList.prototype.toArray = function () {
            return this.elements.slice(0);
        };
        NormalSeparatedSyntaxList.prototype.toNonSeparatorArray = function () {
            var result = [];
            for(var i = 0, n = this.nonSeparatorCount(); i < n; i++) {
                result.push(this.nonSeparatorAt(i));
            }
            return result;
        };
        NormalSeparatedSyntaxList.prototype.childAt = function (index) {
            if(index < 0 || index >= this.elements.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.elements[index];
        };
        NormalSeparatedSyntaxList.prototype.nonSeparatorAt = function (index) {
            var value = index * 2;
            if(value < 0 || value >= this.elements.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.elements[value];
        };
        NormalSeparatedSyntaxList.prototype.separatorAt = function (index) {
            var value = index * 2 + 1;
            if(value < 0 || value >= this.elements.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.elements[value];
        };
        NormalSeparatedSyntaxList.prototype.firstToken = function () {
            var token;
            for(var i = 0, n = this.elements.length; i < n; i++) {
                if(i % 2 === 0) {
                    var nodeOrToken = this.elements[i];
                    token = nodeOrToken.firstToken();
                    if(token !== null) {
                        return token;
                    }
                } else {
                    token = this.elements[i];
                    if(token.width() > 0) {
                        return token;
                    }
                }
            }
            return null;
        };
        NormalSeparatedSyntaxList.prototype.lastToken = function () {
            var token;
            for(var i = this.elements.length - 1; i >= 0; i--) {
                if(i % 2 === 0) {
                    var nodeOrToken = this.elements[i];
                    token = nodeOrToken.lastToken();
                    if(token !== null) {
                        return token;
                    }
                } else {
                    token = this.elements[i];
                    if(token.width() > 0) {
                        return token;
                    }
                }
            }
            return null;
        };
        NormalSeparatedSyntaxList.prototype.fullText = function () {
            var elements = [];
            this.collectTextElements(elements);
            return elements.join("");
        };
        NormalSeparatedSyntaxList.prototype.isTypeScriptSpecific = function () {
            for(var i = 0, n = this.nonSeparatorCount(); i < n; i++) {
                if(this.nonSeparatorAt(i).isTypeScriptSpecific()) {
                    return true;
                }
            }
            return false;
        };
        NormalSeparatedSyntaxList.prototype.hasSkippedText = function () {
            return (this.data() & 1 /* NodeSkippedTextMask */ ) !== 0;
        };
        NormalSeparatedSyntaxList.prototype.hasZeroWidthToken = function () {
            return (this.data() & 2 /* NodeZeroWidthTokenMask */ ) !== 0;
        };
        NormalSeparatedSyntaxList.prototype.hasRegularExpressionToken = function () {
            return (this.data() & 4 /* NodeRegularExpressionTokenMask */ ) !== 0;
        };
        NormalSeparatedSyntaxList.prototype.fullWidth = function () {
            return this.data() >>> 4 /* NodeFullWidthShift */ ;
        };
        NormalSeparatedSyntaxList.prototype.width = function () {
            var fullWidth = this.fullWidth();
            return fullWidth - this.leadingTriviaWidth() - this.trailingTriviaWidth();
        };
        NormalSeparatedSyntaxList.prototype.leadingTrivia = function () {
            return this.firstToken().leadingTrivia();
        };
        NormalSeparatedSyntaxList.prototype.trailingTrivia = function () {
            return this.lastToken().trailingTrivia();
        };
        NormalSeparatedSyntaxList.prototype.leadingTriviaWidth = function () {
            return this.firstToken().leadingTriviaWidth();
        };
        NormalSeparatedSyntaxList.prototype.trailingTriviaWidth = function () {
            return this.lastToken().trailingTriviaWidth();
        };
        NormalSeparatedSyntaxList.prototype.computeData = function () {
            var fullWidth = 0;
            var hasSkippedText = false;
            var hasZeroWidthToken = false;
            var hasRegularExpressionToken = false;
            for(var i = 0, n = this.elements.length; i < n; i++) {
                var element = this.elements[i];
                var childWidth = element.fullWidth();
                fullWidth += childWidth;
                if(i % 2 === 0) {
                    var nodeOrToken = element;
                    hasSkippedText = hasSkippedText || nodeOrToken.hasSkippedText();
                    hasZeroWidthToken = hasZeroWidthToken || nodeOrToken.hasZeroWidthToken();
                    hasRegularExpressionToken = hasRegularExpressionToken || nodeOrToken.hasRegularExpressionToken();
                } else {
                    var token = element;
                    hasSkippedText = hasSkippedText || token.hasSkippedText();
                    hasZeroWidthToken = hasZeroWidthToken || (childWidth === 0);
                }
            }
            return (fullWidth << 4 /* NodeFullWidthShift */ ) | (hasSkippedText ? 1 /* NodeSkippedTextMask */  : 0) | (hasZeroWidthToken ? 2 /* NodeZeroWidthTokenMask */  : 0) | (hasRegularExpressionToken ? 4 /* NodeRegularExpressionTokenMask */  : 0);
        };
        NormalSeparatedSyntaxList.prototype.data = function () {
            if(this._data === -1) {
                this._data = this.computeData();
            }
            return this._data;
        };
        NormalSeparatedSyntaxList.prototype.findTokenInternal = function (parent, position, fullStart) {
            parent = new PositionedSeparatedList(parent, this, fullStart);
            for(var i = 0, n = this.elements.length; i < n; i++) {
                var element = this.elements[i];
                var childWidth = element.fullWidth();
                if(position < childWidth) {
                    return (element).findTokenInternal(parent, position, fullStart);
                }
                position -= childWidth;
                fullStart += childWidth;
            }
            throw Errors.invalidOperation();
        };
        NormalSeparatedSyntaxList.prototype.collectTextElements = function (elements) {
            for(var i = 0, n = this.elements.length; i < n; i++) {
                var element = this.elements[i];
                element.collectTextElements(elements);
            }
        };
        NormalSeparatedSyntaxList.prototype.insertChildrenInto = function (array, index) {
            if(index === 0) {
                array.unshift.apply(array, this.elements);
            } else {
                array.splice.apply(array, [
                    index, 
                    0
                ].concat(this.elements));
            }
        };
        return NormalSeparatedSyntaxList;
    })();    
    function separatedList(nodes) {
        return separatedListAndValidate(nodes, false);
    }
    Syntax.separatedList = separatedList;
    function separatedListAndValidate(nodes, validate) {
        if(nodes === undefined || nodes === null || nodes.length === 0) {
            return Syntax.emptySeparatedList;
        }
        if(validate) {
            for(var i = 0; i < nodes.length; i++) {
                var item = nodes[i];
                if(i % 2 === 1) {
                    Debug.assert(SyntaxFacts.isTokenKind(item.kind()));
                }
            }
        }
        if(nodes.length === 1) {
            return new SingletonSeparatedSyntaxList(nodes[0]);
        }
        return new NormalSeparatedSyntaxList(nodes);
    }
})(Syntax || (Syntax = {}));
var Syntax;
(function (Syntax) {
    var EmptySyntaxList = (function () {
        function EmptySyntaxList() { }
        EmptySyntaxList.prototype.kind = function () {
            return 1 /* List */ ;
        };
        EmptySyntaxList.prototype.isNode = function () {
            return false;
        };
        EmptySyntaxList.prototype.isToken = function () {
            return false;
        };
        EmptySyntaxList.prototype.isList = function () {
            return true;
        };
        EmptySyntaxList.prototype.isSeparatedList = function () {
            return false;
        };
        EmptySyntaxList.prototype.toJSON = function (key) {
            return [];
        };
        EmptySyntaxList.prototype.childCount = function () {
            return 0;
        };
        EmptySyntaxList.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        EmptySyntaxList.prototype.toArray = function () {
            return [];
        };
        EmptySyntaxList.prototype.collectTextElements = function (elements) {
        };
        EmptySyntaxList.prototype.firstToken = function () {
            return null;
        };
        EmptySyntaxList.prototype.lastToken = function () {
            return null;
        };
        EmptySyntaxList.prototype.fullWidth = function () {
            return 0;
        };
        EmptySyntaxList.prototype.width = function () {
            return 0;
        };
        EmptySyntaxList.prototype.leadingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        EmptySyntaxList.prototype.trailingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        EmptySyntaxList.prototype.leadingTriviaWidth = function () {
            return 0;
        };
        EmptySyntaxList.prototype.trailingTriviaWidth = function () {
            return 0;
        };
        EmptySyntaxList.prototype.fullText = function () {
            return "";
        };
        EmptySyntaxList.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        EmptySyntaxList.prototype.hasSkippedText = function () {
            return false;
        };
        EmptySyntaxList.prototype.hasZeroWidthToken = function () {
            return false;
        };
        EmptySyntaxList.prototype.hasRegularExpressionToken = function () {
            return false;
        };
        EmptySyntaxList.prototype.findTokenInternal = function (parent, position, fullStart) {
            throw Errors.invalidOperation();
        };
        EmptySyntaxList.prototype.insertChildrenInto = function (array, index) {
        };
        return EmptySyntaxList;
    })();    
    Syntax.emptyList = new EmptySyntaxList();
    var SingletonSyntaxList = (function () {
        function SingletonSyntaxList(item) {
            this.item = item;
        }
        SingletonSyntaxList.prototype.kind = function () {
            return 1 /* List */ ;
        };
        SingletonSyntaxList.prototype.isToken = function () {
            return false;
        };
        SingletonSyntaxList.prototype.isNode = function () {
            return false;
        };
        SingletonSyntaxList.prototype.isList = function () {
            return true;
        };
        SingletonSyntaxList.prototype.isSeparatedList = function () {
            return false;
        };
        SingletonSyntaxList.prototype.toJSON = function (key) {
            return [
                this.item
            ];
        };
        SingletonSyntaxList.prototype.childCount = function () {
            return 1;
        };
        SingletonSyntaxList.prototype.childAt = function (index) {
            if(index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.item;
        };
        SingletonSyntaxList.prototype.toArray = function () {
            return [
                this.item
            ];
        };
        SingletonSyntaxList.prototype.collectTextElements = function (elements) {
            this.item.collectTextElements(elements);
        };
        SingletonSyntaxList.prototype.firstToken = function () {
            return this.item.firstToken();
        };
        SingletonSyntaxList.prototype.lastToken = function () {
            return this.item.lastToken();
        };
        SingletonSyntaxList.prototype.fullWidth = function () {
            return this.item.fullWidth();
        };
        SingletonSyntaxList.prototype.width = function () {
            return this.item.width();
        };
        SingletonSyntaxList.prototype.leadingTrivia = function () {
            return this.item.leadingTrivia();
        };
        SingletonSyntaxList.prototype.trailingTrivia = function () {
            return this.item.trailingTrivia();
        };
        SingletonSyntaxList.prototype.leadingTriviaWidth = function () {
            return this.item.leadingTriviaWidth();
        };
        SingletonSyntaxList.prototype.trailingTriviaWidth = function () {
            return this.item.trailingTriviaWidth();
        };
        SingletonSyntaxList.prototype.fullText = function () {
            return this.item.fullText();
        };
        SingletonSyntaxList.prototype.isTypeScriptSpecific = function () {
            return this.item.isTypeScriptSpecific();
        };
        SingletonSyntaxList.prototype.hasSkippedText = function () {
            return this.item.hasSkippedText();
        };
        SingletonSyntaxList.prototype.hasZeroWidthToken = function () {
            return this.item.hasZeroWidthToken();
        };
        SingletonSyntaxList.prototype.hasRegularExpressionToken = function () {
            return this.item.hasRegularExpressionToken();
        };
        SingletonSyntaxList.prototype.findTokenInternal = function (parent, position, fullStart) {
            Debug.assert(position >= 0 && position < this.item.fullWidth());
            return (this.item).findTokenInternal(new PositionedList(parent, this, fullStart), position, fullStart);
        };
        SingletonSyntaxList.prototype.insertChildrenInto = function (array, index) {
            array.splice(index, 0, this.item);
        };
        return SingletonSyntaxList;
    })();    
    var NormalSyntaxList = (function () {
        function NormalSyntaxList(nodeOrTokens) {
            this._data = -1;
            this.nodeOrTokens = nodeOrTokens;
        }
        NormalSyntaxList.prototype.kind = function () {
            return 1 /* List */ ;
        };
        NormalSyntaxList.prototype.isNode = function () {
            return false;
        };
        NormalSyntaxList.prototype.isToken = function () {
            return false;
        };
        NormalSyntaxList.prototype.isList = function () {
            return true;
        };
        NormalSyntaxList.prototype.isSeparatedList = function () {
            return false;
        };
        NormalSyntaxList.prototype.toJSON = function (key) {
            return this.nodeOrTokens;
        };
        NormalSyntaxList.prototype.childCount = function () {
            return this.nodeOrTokens.length;
        };
        NormalSyntaxList.prototype.childAt = function (index) {
            if(index < 0 || index >= this.nodeOrTokens.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.nodeOrTokens[index];
        };
        NormalSyntaxList.prototype.toArray = function () {
            return this.nodeOrTokens.slice(0);
        };
        NormalSyntaxList.prototype.collectTextElements = function (elements) {
            for(var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                var element = this.nodeOrTokens[i];
                element.collectTextElements(elements);
            }
        };
        NormalSyntaxList.prototype.firstToken = function () {
            for(var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                var token = this.nodeOrTokens[i].firstToken();
                if(token !== null) {
                    return token;
                }
            }
            return null;
        };
        NormalSyntaxList.prototype.lastToken = function () {
            for(var i = this.nodeOrTokens.length - 1; i >= 0; i--) {
                var token = this.nodeOrTokens[i].lastToken();
                if(token !== null) {
                    return token;
                }
            }
            return null;
        };
        NormalSyntaxList.prototype.fullText = function () {
            var elements = [];
            this.collectTextElements(elements);
            return elements.join("");
        };
        NormalSyntaxList.prototype.isTypeScriptSpecific = function () {
            for(var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                if(this.nodeOrTokens[i].isTypeScriptSpecific()) {
                    return true;
                }
            }
            return false;
        };
        NormalSyntaxList.prototype.hasSkippedText = function () {
            return (this.data() & 1 /* NodeSkippedTextMask */ ) !== 0;
        };
        NormalSyntaxList.prototype.hasZeroWidthToken = function () {
            return (this.data() & 2 /* NodeZeroWidthTokenMask */ ) !== 0;
        };
        NormalSyntaxList.prototype.hasRegularExpressionToken = function () {
            return (this.data() & 4 /* NodeRegularExpressionTokenMask */ ) !== 0;
        };
        NormalSyntaxList.prototype.fullWidth = function () {
            return this.data() >>> 4 /* NodeFullWidthShift */ ;
        };
        NormalSyntaxList.prototype.width = function () {
            var fullWidth = this.fullWidth();
            return fullWidth - this.leadingTriviaWidth() - this.trailingTriviaWidth();
        };
        NormalSyntaxList.prototype.leadingTrivia = function () {
            return this.firstToken().leadingTrivia();
        };
        NormalSyntaxList.prototype.trailingTrivia = function () {
            return this.lastToken().trailingTrivia();
        };
        NormalSyntaxList.prototype.leadingTriviaWidth = function () {
            return this.firstToken().leadingTriviaWidth();
        };
        NormalSyntaxList.prototype.trailingTriviaWidth = function () {
            return this.lastToken().trailingTriviaWidth();
        };
        NormalSyntaxList.prototype.computeData = function () {
            var fullWidth = 0;
            var hasSkippedText = false;
            var hasZeroWidthToken = false;
            var hasRegularExpressionToken = false;
            for(var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                var node = this.nodeOrTokens[i];
                fullWidth += node.fullWidth();
                hasSkippedText = hasSkippedText || node.hasSkippedText();
                hasZeroWidthToken = hasZeroWidthToken || node.hasZeroWidthToken();
                hasRegularExpressionToken = hasRegularExpressionToken || node.hasRegularExpressionToken();
            }
            return (fullWidth << 4 /* NodeFullWidthShift */ ) | (hasSkippedText ? 1 /* NodeSkippedTextMask */  : 0) | (hasZeroWidthToken ? 2 /* NodeZeroWidthTokenMask */  : 0) | (hasRegularExpressionToken ? 4 /* NodeRegularExpressionTokenMask */  : 0);
        };
        NormalSyntaxList.prototype.data = function () {
            if(this._data === -1) {
                this._data = this.computeData();
            }
            return this._data;
        };
        NormalSyntaxList.prototype.findTokenInternal = function (parent, position, fullStart) {
            Debug.assert(position >= 0 && position < this.fullWidth());
            parent = new PositionedList(parent, this, fullStart);
            for(var i = 0, n = this.nodeOrTokens.length; i < n; i++) {
                var nodeOrToken = this.nodeOrTokens[i];
                var childWidth = nodeOrToken.fullWidth();
                if(position < childWidth) {
                    return (nodeOrToken).findTokenInternal(parent, position, fullStart);
                }
                position -= childWidth;
                fullStart += childWidth;
            }
            throw Errors.invalidOperation();
        };
        NormalSyntaxList.prototype.insertChildrenInto = function (array, index) {
            if(index === 0) {
                array.unshift.apply(array, this.nodeOrTokens);
            } else {
                array.splice.apply(array, [
                    index, 
                    0
                ].concat(this.nodeOrTokens));
            }
        };
        return NormalSyntaxList;
    })();    
    function list(nodes) {
        if(nodes === undefined || nodes === null || nodes.length === 0) {
            return Syntax.emptyList;
        }
        if(nodes.length === 1) {
            var item = nodes[0];
            return new SingletonSyntaxList(item);
        }
        return new NormalSyntaxList(nodes);
    }
    Syntax.list = list;
})(Syntax || (Syntax = {}));
var Errors = (function () {
    function Errors() { }
    Errors.argument = function argument(argument, message) {
        return new Error("Invalid argument: " + argument + "." + (message ? (" " + message) : ""));
    };
    Errors.argumentOutOfRange = function argumentOutOfRange(argument) {
        return new Error("Argument out of range: " + argument + ".");
    };
    Errors.argumentNull = function argumentNull(argument) {
        return new Error("Argument null: " + argument + ".");
    };
    Errors.abstract1 = function abstract1() {
        return new Error("Operation not implemented properly by subclass.");
    };
    Errors.notYetImplemented = function notYetImplemented() {
        return new Error("Not yet implemented.");
    };
    Errors.invalidOperation = function invalidOperation(message) {
        return new Error(message ? ("Invalid operation: " + message) : "Invalid operation.");
    };
    return Errors;
})();
var Hash = (function () {
    function Hash() { }
    Hash.FNV_BASE = 2166136261;
    Hash.FNV_PRIME = 16777619;
    Hash.computeFnv1aCharArrayHashCode = function computeFnv1aCharArrayHashCode(text, start, len) {
        var hashCode = Hash.FNV_BASE;
        var end = start + len;
        for(var i = start; i < end; i++) {
            hashCode = (hashCode ^ text[i]) * Hash.FNV_PRIME;
        }
        return hashCode;
    };
    Hash.computeSimple31BitCharArrayHashCode = function computeSimple31BitCharArrayHashCode(key, start, len) {
        var hash = 0;
        for(var i = 0; i < len; i++) {
            var ch = key[start + i];
            hash = (((hash << 5) + hash) + ch) | 0;
        }
        return hash & 2147483647;
    };
    Hash.computeSimple31BitStringHashCode = function computeSimple31BitStringHashCode(key) {
        var hash = 0;
        var start = 0;
        var len = key.length;
        for(var i = 0; i < len; i++) {
            var ch = key.charCodeAt(start + i);
            hash = (((hash << 5) + hash) + ch) | 0;
        }
        return hash & 2147483647;
    };
    Hash.computeMurmur2CharArrayHashCode = function computeMurmur2CharArrayHashCode(key, start, len) {
        var m = 1540483477;
        var r = 24;
        var numberOfCharsLeft = len;
        var h = (0 ^ numberOfCharsLeft);
        var index = start;
        while(numberOfCharsLeft >= 2) {
            var c1 = key[index];
            var c2 = key[index + 1];
            var k = c1 | (c2 << 16);
            k *= m;
            k ^= k >> r;
            k *= m;
            h *= m;
            h ^= k;
            index += 2;
            numberOfCharsLeft -= 2;
        }
        if(numberOfCharsLeft === 1) {
            h ^= key[index];
            h *= m;
        }
        h ^= h >> 13;
        h *= m;
        h ^= h >> 15;
        return h;
    };
    Hash.computeMurmur2StringHashCode = function computeMurmur2StringHashCode(key) {
        var m = 1540483477;
        var r = 24;
        var start = 0;
        var len = key.length;
        var numberOfCharsLeft = len;
        var h = (0 ^ numberOfCharsLeft);
        var index = start;
        while(numberOfCharsLeft >= 2) {
            var c1 = key.charCodeAt(index);
            var c2 = key.charCodeAt(index + 1);
            var k = c1 | (c2 << 16);
            k *= m;
            k ^= k >> r;
            k *= m;
            h *= m;
            h ^= k;
            index += 2;
            numberOfCharsLeft -= 2;
        }
        if(numberOfCharsLeft === 1) {
            h ^= key.charCodeAt(index);
            h *= m;
        }
        h ^= h >> 13;
        h *= m;
        h ^= h >> 15;
        return h;
    };
    Hash.primes = [
        3, 
        7, 
        11, 
        17, 
        23, 
        29, 
        37, 
        47, 
        59, 
        71, 
        89, 
        107, 
        131, 
        163, 
        197, 
        239, 
        293, 
        353, 
        431, 
        521, 
        631, 
        761, 
        919, 
        1103, 
        1327, 
        1597, 
        1931, 
        2333, 
        2801, 
        3371, 
        4049, 
        4861, 
        5839, 
        7013, 
        8419, 
        10103, 
        12143, 
        14591, 
        17519, 
        21023, 
        25229, 
        30293, 
        36353, 
        43627, 
        52361, 
        62851, 
        75431, 
        90523, 
        108631, 
        130363, 
        156437, 
        187751, 
        225307, 
        270371, 
        324449, 
        389357, 
        467237, 
        560689, 
        672827, 
        807403, 
        968897, 
        1162687, 
        1395263, 
        1674319, 
        2009191, 
        2411033, 
        2893249, 
        3471899, 
        4166287, 
        4999559, 
        5999471, 
        7199369
    ];
    Hash.getPrime = function getPrime(min) {
        for(var i = 0; i < Hash.primes.length; i++) {
            var num = Hash.primes[i];
            if(num >= min) {
                return num;
            }
        }
        throw Errors.notYetImplemented();
    };
    Hash.expandPrime = function expandPrime(oldSize) {
        var num = oldSize << 1;
        if(num > 2146435069 && 2146435069 > oldSize) {
            return 2146435069;
        }
        return Hash.getPrime(num);
    };
    Hash.combine = function combine(value, currentHash) {
        return (((currentHash << 5) + currentHash) + value) & 2147483647;
    };
    return Hash;
})();
var ArrayUtilities = (function () {
    function ArrayUtilities() { }
    ArrayUtilities.isArray = function isArray(value) {
        return Object.prototype.toString.apply(value, []) === '[object Array]';
    };
    ArrayUtilities.sequenceEquals = function sequenceEquals(array1, array2, equals) {
        if(array1 === array2) {
            return true;
        }
        if(array1 === null || array2 === null) {
            return false;
        }
        if(array1.length !== array2.length) {
            return false;
        }
        for(var i = 0, n = array1.length; i < n; i++) {
            if(!equals(array1[i], array2[i])) {
                return false;
            }
        }
        return true;
    };
    ArrayUtilities.contains = function contains(array, value) {
        for(var i = 0; i < array.length; i++) {
            if(array[i] === value) {
                return true;
            }
        }
        return false;
    };
    ArrayUtilities.groupBy = function groupBy(array, func) {
        var result = {
        };
        for(var i = 0, n = array.length; i < n; i++) {
            var v = array[i];
            var k = func(v);
            var list = result[k] || [];
            list.push(v);
            result[k] = list;
        }
        return result;
    };
    ArrayUtilities.min = function min(array, func) {
        Debug.assert(array.length > 0);
        var min = func(array[0]);
        for(var i = 1; i < array.length; i++) {
            var next = func(array[i]);
            if(next < min) {
                min = next;
            }
        }
        return min;
    };
    ArrayUtilities.max = function max(array, func) {
        Debug.assert(array.length > 0);
        var max = func(array[0]);
        for(var i = 1; i < array.length; i++) {
            var next = func(array[i]);
            if(next > max) {
                max = next;
            }
        }
        return max;
    };
    ArrayUtilities.last = function last(array) {
        if(array.length === 0) {
            throw Errors.argumentOutOfRange('array');
        }
        return array[array.length - 1];
    };
    ArrayUtilities.firstOrDefault = function firstOrDefault(array, func) {
        for(var i = 0, n = array.length; i < n; i++) {
            var value = array[i];
            if(func(value)) {
                return value;
            }
        }
        return null;
    };
    ArrayUtilities.sum = function sum(array, func) {
        var result = 0;
        for(var i = 0, n = array.length; i < n; i++) {
            result += func(array[i]);
        }
        return result;
    };
    ArrayUtilities.whereNotNull = function whereNotNull(array) {
        var result = [];
        for(var i = 0; i < array.length; i++) {
            var value = array[i];
            if(value !== null) {
                result.push(value);
            }
        }
        return result;
    };
    ArrayUtilities.select = function select(values, func) {
        var result = [];
        for(var i = 0; i < values.length; i++) {
            result.push(func(values[i]));
        }
        return result;
    };
    ArrayUtilities.where = function where(values, func) {
        var result = [];
        for(var i = 0; i < values.length; i++) {
            if(func(values[i])) {
                result.push(values[i]);
            }
        }
        return result;
    };
    ArrayUtilities.any = function any(array, func) {
        for(var i = 0, n = array.length; i < n; i++) {
            if(func(array[i])) {
                return true;
            }
        }
        return false;
    };
    ArrayUtilities.all = function all(array, func) {
        for(var i = 0, n = array.length; i < n; i++) {
            if(!func(array[i])) {
                return false;
            }
        }
        return true;
    };
    ArrayUtilities.binarySearch = function binarySearch(array, value) {
        var low = 0;
        var high = array.length - 1;
        while(low <= high) {
            var middle = low + ((high - low) >> 1);
            var midValue = array[middle];
            if(midValue === value) {
                return middle;
            } else if(midValue > value) {
                high = middle - 1;
            } else {
                low = middle + 1;
            }
        }
        return ~low;
    };
    ArrayUtilities.createArray = function createArray(length, defaultvalue) {
        if (typeof defaultvalue === "undefined") { defaultvalue = null; }
        var result = [];
        for(var i = 0; i < length; i++) {
            result.push(defaultvalue);
        }
        return result;
    };
    ArrayUtilities.grow = function grow(array, length, defaultValue) {
        var count = length - array.length;
        for(var i = 0; i < count; i++) {
            array.push(defaultValue);
        }
    };
    ArrayUtilities.copy = function copy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
        for(var i = 0; i < length; i++) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
    };
    return ArrayUtilities;
})();
var SlidingWindow = (function () {
    function SlidingWindow(source, window, defaultValue, sourceLength) {
        if (typeof sourceLength === "undefined") { sourceLength = -1; }
        this.source = source;
        this.window = window;
        this.defaultValue = defaultValue;
        this.sourceLength = sourceLength;
        this.windowCount = 0;
        this.windowAbsoluteStartIndex = 0;
        this.currentRelativeItemIndex = 0;
        this._pinCount = 0;
        this.firstPinnedAbsoluteIndex = -1;
    }
    SlidingWindow.prototype.windowAbsoluteEndIndex = function () {
        return this.windowAbsoluteStartIndex + this.windowCount;
    };
    SlidingWindow.prototype.addMoreItemsToWindow = function (argument) {
        if(this.sourceLength >= 0 && this.absoluteIndex() >= this.sourceLength) {
            return false;
        }
        if(this.windowCount >= this.window.length) {
            this.tryShiftOrGrowWindow();
        }
        var spaceAvailable = this.window.length - this.windowCount;
        var amountFetched = this.source.fetchMoreItems(argument, this.windowAbsoluteEndIndex(), this.window, this.windowCount, spaceAvailable);
        this.windowCount += amountFetched;
        return amountFetched > 0;
    };
    SlidingWindow.prototype.tryShiftOrGrowWindow = function () {
        var currentIndexIsPastWindowHalfwayPoint = this.currentRelativeItemIndex > (this.window.length >>> 1);
        var isAllowedToShift = this.firstPinnedAbsoluteIndex === -1 || this.firstPinnedAbsoluteIndex > this.windowAbsoluteStartIndex;
        if(currentIndexIsPastWindowHalfwayPoint && isAllowedToShift) {
            var shiftStartIndex = this.firstPinnedAbsoluteIndex === -1 ? this.currentRelativeItemIndex : this.firstPinnedAbsoluteIndex - this.windowAbsoluteStartIndex;
            var shiftCount = this.windowCount - shiftStartIndex;
            Debug.assert(shiftStartIndex > 0);
            if(shiftCount > 0) {
                ArrayUtilities.copy(this.window, shiftStartIndex, this.window, 0, shiftCount);
            }
            this.windowAbsoluteStartIndex += shiftStartIndex;
            this.windowCount -= shiftStartIndex;
            this.currentRelativeItemIndex -= shiftStartIndex;
        } else {
            ArrayUtilities.grow(this.window, this.window.length * 2, this.defaultValue);
        }
    };
    SlidingWindow.prototype.absoluteIndex = function () {
        return this.windowAbsoluteStartIndex + this.currentRelativeItemIndex;
    };
    SlidingWindow.prototype.isAtEndOfSource = function () {
        return this.absoluteIndex() >= this.sourceLength;
    };
    SlidingWindow.prototype.getAndPinAbsoluteIndex = function () {
        var absoluteIndex = this.absoluteIndex();
        var pinCount = this._pinCount++;
        if(pinCount === 0) {
            this.firstPinnedAbsoluteIndex = absoluteIndex;
        }
        return absoluteIndex;
    };
    SlidingWindow.prototype.releaseAndUnpinAbsoluteIndex = function (absoluteIndex) {
        this._pinCount--;
        if(this._pinCount === 0) {
            this.firstPinnedAbsoluteIndex = -1;
        }
    };
    SlidingWindow.prototype.rewindToPinnedIndex = function (absoluteIndex) {
        var relativeIndex = absoluteIndex - this.windowAbsoluteStartIndex;
        Debug.assert(relativeIndex >= 0 && relativeIndex < this.windowCount);
        this.currentRelativeItemIndex = relativeIndex;
    };
    SlidingWindow.prototype.currentItem = function (argument) {
        if(this.currentRelativeItemIndex >= this.windowCount) {
            if(!this.addMoreItemsToWindow(argument)) {
                return this.defaultValue;
            }
        }
        return this.window[this.currentRelativeItemIndex];
    };
    SlidingWindow.prototype.peekItemN = function (n) {
        Debug.assert(n >= 0);
        while(this.currentRelativeItemIndex + n >= this.windowCount) {
            if(!this.addMoreItemsToWindow(null)) {
                return this.defaultValue;
            }
        }
        return this.window[this.currentRelativeItemIndex + n];
    };
    SlidingWindow.prototype.moveToNextItem = function () {
        this.currentRelativeItemIndex++;
    };
    SlidingWindow.prototype.disgardAllItemsFromCurrentIndexOnwards = function () {
        this.windowCount = this.currentRelativeItemIndex;
    };
    SlidingWindow.prototype.setAbsoluteIndex = function (absoluteIndex) {
        if(this.absoluteIndex() === absoluteIndex) {
            return;
        }
        if(this._pinCount > 0) {
            Debug.assert(absoluteIndex >= this.windowAbsoluteStartIndex && absoluteIndex < this.windowAbsoluteEndIndex());
        }
        if(absoluteIndex >= this.windowAbsoluteStartIndex && absoluteIndex < this.windowAbsoluteEndIndex()) {
            this.currentRelativeItemIndex = (absoluteIndex - this.windowAbsoluteStartIndex);
        } else {
            this.windowAbsoluteStartIndex = absoluteIndex;
            this.windowCount = 0;
            this.currentRelativeItemIndex = 0;
        }
    };
    SlidingWindow.prototype.pinCount = function () {
        return this._pinCount;
    };
    return SlidingWindow;
})();
var CharacterCodes;
(function (CharacterCodes) {
    CharacterCodes._map = [];
    CharacterCodes.nullCharacter = 0;
    CharacterCodes.maxAsciiCharacter = 127;
    CharacterCodes.lineFeed = 10;
    CharacterCodes.carriageReturn = 13;
    CharacterCodes.lineSeparator = 8232;
    CharacterCodes.paragraphSeparator = 8233;
    CharacterCodes.space = 32;
    CharacterCodes.nextLine = 133;
    CharacterCodes.nonBreakingSpace = 160;
    CharacterCodes._ = 95;
    CharacterCodes.$ = 36;
    CharacterCodes._0 = 48;
    CharacterCodes._9 = 57;
    CharacterCodes.a = 97;
    CharacterCodes.b = 98;
    CharacterCodes.c = 99;
    CharacterCodes.d = 100;
    CharacterCodes.e = 101;
    CharacterCodes.f = 102;
    CharacterCodes.g = 103;
    CharacterCodes.h = 104;
    CharacterCodes.i = 105;
    CharacterCodes.k = 107;
    CharacterCodes.l = 108;
    CharacterCodes.m = 109;
    CharacterCodes.n = 110;
    CharacterCodes.o = 111;
    CharacterCodes.p = 112;
    CharacterCodes.r = 114;
    CharacterCodes.s = 115;
    CharacterCodes.t = 116;
    CharacterCodes.u = 117;
    CharacterCodes.v = 118;
    CharacterCodes.w = 119;
    CharacterCodes.x = 120;
    CharacterCodes.y = 121;
    CharacterCodes.z = 122;
    CharacterCodes.A = 65;
    CharacterCodes.E = 69;
    CharacterCodes.F = 70;
    CharacterCodes.X = 88;
    CharacterCodes.Z = 90;
    CharacterCodes.ampersand = 38;
    CharacterCodes.asterisk = 42;
    CharacterCodes.backslash = 92;
    CharacterCodes.bar = 124;
    CharacterCodes.caret = 94;
    CharacterCodes.closeBrace = 125;
    CharacterCodes.closeBracket = 93;
    CharacterCodes.closeParen = 41;
    CharacterCodes.colon = 58;
    CharacterCodes.comma = 44;
    CharacterCodes.dot = 46;
    CharacterCodes.doubleQuote = 34;
    CharacterCodes.equals = 61;
    CharacterCodes.exclamation = 33;
    CharacterCodes.greaterThan = 62;
    CharacterCodes.lessThan = 60;
    CharacterCodes.minus = 45;
    CharacterCodes.openBrace = 123;
    CharacterCodes.openBracket = 91;
    CharacterCodes.openParen = 40;
    CharacterCodes.percent = 37;
    CharacterCodes.plus = 43;
    CharacterCodes.question = 63;
    CharacterCodes.semicolon = 59;
    CharacterCodes.singleQuote = 39;
    CharacterCodes.slash = 47;
    CharacterCodes.tilde = 126;
    CharacterCodes.backspace = 8;
    CharacterCodes.formFeed = 12;
    CharacterCodes.byteOrderMark = 65279;
    CharacterCodes.tab = 9;
    CharacterCodes.verticalTab = 11;
})(CharacterCodes || (CharacterCodes = {}));
var CharacterInfo = (function () {
    function CharacterInfo() { }
    CharacterInfo.isDecimalDigit = function isDecimalDigit(c) {
        return c >= 48 /* _0 */  && c <= 57 /* _9 */ ;
    };
    CharacterInfo.isHexDigit = function isHexDigit(c) {
        return CharacterInfo.isDecimalDigit(c) || (c >= 65 /* A */  && c <= 70 /* F */ ) || (c >= 97 /* a */  && c <= 102 /* f */ );
    };
    CharacterInfo.hexValue = function hexValue(c) {
        Debug.assert(CharacterInfo.isHexDigit(c));
        return CharacterInfo.isDecimalDigit(c) ? (c - 48 /* _0 */ ) : (c >= 65 /* A */  && c <= 70 /* F */ ) ? c - 65 /* A */  + 10 : c - 97 /* a */  + 10;
    };
    CharacterInfo.isWhitespace = function isWhitespace(ch) {
        switch(ch) {
            case 32 /* space */ :
            case 9 /* tab */ :
            case 11 /* verticalTab */ :
            case 12 /* formFeed */ :
            case 160 /* nonBreakingSpace */ :
            case 65279 /* byteOrderMark */ :
                return true;
        }
        return false;
    };
    CharacterInfo.isLineTerminator = function isLineTerminator(ch) {
        switch(ch) {
            case 13 /* carriageReturn */ :
            case 10 /* lineFeed */ :
            case 8233 /* paragraphSeparator */ :
            case 8232 /* lineSeparator */ :
                return true;
        }
        return false;
    };
    return CharacterInfo;
})();
var SyntaxConstants;
(function (SyntaxConstants) {
    SyntaxConstants._map = [];
    SyntaxConstants.TriviaNewLineMask = 1;
    SyntaxConstants.TriviaCommentMask = 2;
    SyntaxConstants.TriviaFullWidthShift = 2;
    SyntaxConstants.NodeSkippedTextMask = 1;
    SyntaxConstants.NodeZeroWidthTokenMask = 2;
    SyntaxConstants.NodeRegularExpressionTokenMask = 4;
    SyntaxConstants.NodeParsedInStrictModeMask = 8;
    SyntaxConstants.NodeFullWidthShift = 4;
})(SyntaxConstants || (SyntaxConstants = {}));
var LanguageVersion;
(function (LanguageVersion) {
    LanguageVersion._map = [];
    LanguageVersion._map[0] = "EcmaScript3";
    LanguageVersion.EcmaScript3 = 0;
    LanguageVersion._map[1] = "EcmaScript5";
    LanguageVersion.EcmaScript5 = 1;
})(LanguageVersion || (LanguageVersion = {}));
var Contract = (function () {
    function Contract() { }
    Contract.requires = function requires(expression) {
        if(!expression) {
            throw new Error("Contract violated. False expression.");
        }
    };
    Contract.throwIfFalse = function throwIfFalse(expression) {
        if(!expression) {
            throw new Error("Contract violated. False expression.");
        }
    };
    Contract.throwIfNull = function throwIfNull(value) {
        if(value === null) {
            throw new Error("Contract violated. Null value.");
        }
    };
    return Contract;
})();
var MathPrototype = (function () {
    function MathPrototype() { }
    MathPrototype.max = function max(a, b) {
        return a >= b ? a : b;
    };
    MathPrototype.min = function min(a, b) {
        return a <= b ? a : b;
    };
    return MathPrototype;
})();
var TextSpan = (function () {
    function TextSpan(start, length) {
        if(start < 0) {
            Errors.argument("start");
        }
        if(start + length < start) {
            throw new Error("length");
        }
        this._start = start;
        this._length = length;
    }
    TextSpan.prototype.start = function () {
        return this._start;
    };
    TextSpan.prototype.length = function () {
        return this._length;
    };
    TextSpan.prototype.end = function () {
        return this._start + this._length;
    };
    TextSpan.prototype.isEmpty = function () {
        return this._length === 0;
    };
    TextSpan.prototype.containsPosition = function (position) {
        return position >= this._start && position < this.end();
    };
    TextSpan.prototype.containsTextSpan = function (span) {
        return span._start >= this._start && span.end() <= this.end();
    };
    TextSpan.prototype.overlapsWith = function (span) {
        var overlapStart = MathPrototype.max(this._start, span._start);
        var overlapEnd = MathPrototype.min(this.end(), span.end());
        return overlapStart < overlapEnd;
    };
    TextSpan.prototype.overlap = function (span) {
        var overlapStart = MathPrototype.max(this._start, span._start);
        var overlapEnd = MathPrototype.min(this.end(), span.end());
        if(overlapStart < overlapEnd) {
            return TextSpan.fromBounds(overlapStart, overlapEnd);
        }
        return null;
    };
    TextSpan.prototype.intersectsWithTextSpan = function (span) {
        return span._start <= this.end() && span.end() >= this._start;
    };
    TextSpan.prototype.intersectsWith = function (start, length) {
        var end = start + length;
        return start <= this.end() && end >= this._start;
    };
    TextSpan.prototype.intersectsWithPosition = function (position) {
        return position <= this.end() && position >= this._start;
    };
    TextSpan.prototype.intersection = function (span) {
        var intersectStart = MathPrototype.max(this._start, span._start);
        var intersectEnd = MathPrototype.min(this.end(), span.end());
        if(intersectStart <= intersectEnd) {
            return TextSpan.fromBounds(intersectStart, intersectEnd);
        }
        return null;
    };
    TextSpan.fromBounds = function fromBounds(start, end) {
        Contract.requires(start >= 0);
        Contract.requires(end - start >= 0);
        return new TextSpan(start, end - start);
    };
    return TextSpan;
})();
var LinePosition = (function () {
    function LinePosition(line, character) {
        this._line = 0;
        this._character = 0;
        if(line < 0) {
            throw Errors.argumentOutOfRange("line");
        }
        if(character < 0) {
            throw Errors.argumentOutOfRange("character");
        }
        this._line = line;
        this._character = character;
    }
    LinePosition.prototype.line = function () {
        return this._line;
    };
    LinePosition.prototype.character = function () {
        return this._character;
    };
    return LinePosition;
})();
var JSON2 = {
};
((function () {
    'use strict';
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if(typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
        };
        var strProto = String.prototype;
        var numProto = Number.prototype;
        numProto.JSON = strProto.JSON = (Boolean).prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }, rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i, k = null, v, length, mind = gap, partial, value = holder[key];
        if(value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if(typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch(typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if(!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if(Object.prototype.toString.apply(value, []) === '[object Array]') {
                    length = value.length;
                    for(i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if(rep && typeof rep === 'object') {
                    length = rep.length;
                    for(i = 0; i < length; i += 1) {
                        if(typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if(v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for(k in value) {
                        if(Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if(v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if(typeof JSON2.stringify !== 'function') {
        JSON2.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if(typeof space === 'number') {
                for(i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if(typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if(replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {
                '': value
            });
        };
    }
    if(typeof JSON2.parse !== 'function') {
        JSON2.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k = null, v, value = holder[key];
                if(value && typeof value === 'object') {
                    for(k in value) {
                        if(Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if(v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if(cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
})());
var ScannerUtilities = (function () {
    function ScannerUtilities() { }
    ScannerUtilities.identifierKind = function identifierKind(array, startIndex, length) {
        switch(length) {
            case 2:
                switch(array[startIndex]) {
                    case 100 /* d */ :
                        return (array[startIndex + 1] === 111 /* o */ ) ? 22 /* DoKeyword */  : 11 /* IdentifierName */ ;
                    case 105 /* i */ :
                        switch(array[startIndex + 1]) {
                            case 102 /* f */ :
                                return 28 /* IfKeyword */ ;
                            case 110 /* n */ :
                                return 29 /* InKeyword */ ;
                            default:
                                return 11 /* IdentifierName */ ;
                        }
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 3:
                switch(array[startIndex]) {
                    case 102 /* f */ :
                        return (array[startIndex + 1] === 111 /* o */  && array[startIndex + 2] === 114 /* r */ ) ? 26 /* ForKeyword */  : 11 /* IdentifierName */ ;
                    case 110 /* n */ :
                        return (array[startIndex + 1] === 101 /* e */  && array[startIndex + 2] === 119 /* w */ ) ? 31 /* NewKeyword */  : 11 /* IdentifierName */ ;
                    case 116 /* t */ :
                        return (array[startIndex + 1] === 114 /* r */  && array[startIndex + 2] === 121 /* y */ ) ? 38 /* TryKeyword */  : 11 /* IdentifierName */ ;
                    case 118 /* v */ :
                        return (array[startIndex + 1] === 97 /* a */  && array[startIndex + 2] === 114 /* r */ ) ? 40 /* VarKeyword */  : 11 /* IdentifierName */ ;
                    case 108 /* l */ :
                        return (array[startIndex + 1] === 101 /* e */  && array[startIndex + 2] === 116 /* t */ ) ? 53 /* LetKeyword */  : 11 /* IdentifierName */ ;
                    case 97 /* a */ :
                        return (array[startIndex + 1] === 110 /* n */  && array[startIndex + 2] === 121 /* y */ ) ? 60 /* AnyKeyword */  : 11 /* IdentifierName */ ;
                    case 103 /* g */ :
                        return (array[startIndex + 1] === 101 /* e */  && array[startIndex + 2] === 116 /* t */ ) ? 65 /* GetKeyword */  : 11 /* IdentifierName */ ;
                    case 115 /* s */ :
                        return (array[startIndex + 1] === 101 /* e */  && array[startIndex + 2] === 116 /* t */ ) ? 68 /* SetKeyword */  : 11 /* IdentifierName */ ;
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 4:
                switch(array[startIndex]) {
                    case 99 /* c */ :
                        return (array[startIndex + 1] === 97 /* a */  && array[startIndex + 2] === 115 /* s */  && array[startIndex + 3] === 101 /* e */ ) ? 16 /* CaseKeyword */  : 11 /* IdentifierName */ ;
                    case 101 /* e */ :
                        switch(array[startIndex + 1]) {
                            case 108 /* l */ :
                                return (array[startIndex + 2] === 115 /* s */  && array[startIndex + 3] === 101 /* e */ ) ? 23 /* ElseKeyword */  : 11 /* IdentifierName */ ;
                            case 110 /* n */ :
                                return (array[startIndex + 2] === 117 /* u */  && array[startIndex + 3] === 109 /* m */ ) ? 46 /* EnumKeyword */  : 11 /* IdentifierName */ ;
                            default:
                                return 11 /* IdentifierName */ ;
                        }
                    case 110 /* n */ :
                        return (array[startIndex + 1] === 117 /* u */  && array[startIndex + 2] === 108 /* l */  && array[startIndex + 3] === 108 /* l */ ) ? 32 /* NullKeyword */  : 11 /* IdentifierName */ ;
                    case 116 /* t */ :
                        switch(array[startIndex + 1]) {
                            case 104 /* h */ :
                                return (array[startIndex + 2] === 105 /* i */  && array[startIndex + 3] === 115 /* s */ ) ? 35 /* ThisKeyword */  : 11 /* IdentifierName */ ;
                            case 114 /* r */ :
                                return (array[startIndex + 2] === 117 /* u */  && array[startIndex + 3] === 101 /* e */ ) ? 37 /* TrueKeyword */  : 11 /* IdentifierName */ ;
                            default:
                                return 11 /* IdentifierName */ ;
                        }
                    case 118 /* v */ :
                        return (array[startIndex + 1] === 111 /* o */  && array[startIndex + 2] === 105 /* i */  && array[startIndex + 3] === 100 /* d */ ) ? 41 /* VoidKeyword */  : 11 /* IdentifierName */ ;
                    case 119 /* w */ :
                        return (array[startIndex + 1] === 105 /* i */  && array[startIndex + 2] === 116 /* t */  && array[startIndex + 3] === 104 /* h */ ) ? 43 /* WithKeyword */  : 11 /* IdentifierName */ ;
                    case 98 /* b */ :
                        return (array[startIndex + 1] === 111 /* o */  && array[startIndex + 2] === 111 /* o */  && array[startIndex + 3] === 108 /* l */ ) ? 62 /* BoolKeyword */  : 11 /* IdentifierName */ ;
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 5:
                switch(array[startIndex]) {
                    case 98 /* b */ :
                        return (array[startIndex + 1] === 114 /* r */  && array[startIndex + 2] === 101 /* e */  && array[startIndex + 3] === 97 /* a */  && array[startIndex + 4] === 107 /* k */ ) ? 15 /* BreakKeyword */  : 11 /* IdentifierName */ ;
                    case 99 /* c */ :
                        switch(array[startIndex + 1]) {
                            case 97 /* a */ :
                                return (array[startIndex + 2] === 116 /* t */  && array[startIndex + 3] === 99 /* c */  && array[startIndex + 4] === 104 /* h */ ) ? 17 /* CatchKeyword */  : 11 /* IdentifierName */ ;
                            case 108 /* l */ :
                                return (array[startIndex + 2] === 97 /* a */  && array[startIndex + 3] === 115 /* s */  && array[startIndex + 4] === 115 /* s */ ) ? 44 /* ClassKeyword */  : 11 /* IdentifierName */ ;
                            case 111 /* o */ :
                                return (array[startIndex + 2] === 110 /* n */  && array[startIndex + 3] === 115 /* s */  && array[startIndex + 4] === 116 /* t */ ) ? 45 /* ConstKeyword */  : 11 /* IdentifierName */ ;
                            default:
                                return 11 /* IdentifierName */ ;
                        }
                    case 102 /* f */ :
                        return (array[startIndex + 1] === 97 /* a */  && array[startIndex + 2] === 108 /* l */  && array[startIndex + 3] === 115 /* s */  && array[startIndex + 4] === 101 /* e */ ) ? 24 /* FalseKeyword */  : 11 /* IdentifierName */ ;
                    case 116 /* t */ :
                        return (array[startIndex + 1] === 104 /* h */  && array[startIndex + 2] === 114 /* r */  && array[startIndex + 3] === 111 /* o */  && array[startIndex + 4] === 119 /* w */ ) ? 36 /* ThrowKeyword */  : 11 /* IdentifierName */ ;
                    case 119 /* w */ :
                        return (array[startIndex + 1] === 104 /* h */  && array[startIndex + 2] === 105 /* i */  && array[startIndex + 3] === 108 /* l */  && array[startIndex + 4] === 101 /* e */ ) ? 42 /* WhileKeyword */  : 11 /* IdentifierName */ ;
                    case 115 /* s */ :
                        return (array[startIndex + 1] === 117 /* u */  && array[startIndex + 2] === 112 /* p */  && array[startIndex + 3] === 101 /* e */  && array[startIndex + 4] === 114 /* r */ ) ? 50 /* SuperKeyword */  : 11 /* IdentifierName */ ;
                    case 121 /* y */ :
                        return (array[startIndex + 1] === 105 /* i */  && array[startIndex + 2] === 101 /* e */  && array[startIndex + 3] === 108 /* l */  && array[startIndex + 4] === 100 /* d */ ) ? 59 /* YieldKeyword */  : 11 /* IdentifierName */ ;
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 6:
                switch(array[startIndex]) {
                    case 100 /* d */ :
                        return (array[startIndex + 1] === 101 /* e */  && array[startIndex + 2] === 108 /* l */  && array[startIndex + 3] === 101 /* e */  && array[startIndex + 4] === 116 /* t */  && array[startIndex + 5] === 101 /* e */ ) ? 21 /* DeleteKeyword */  : 11 /* IdentifierName */ ;
                    case 114 /* r */ :
                        return (array[startIndex + 1] === 101 /* e */  && array[startIndex + 2] === 116 /* t */  && array[startIndex + 3] === 117 /* u */  && array[startIndex + 4] === 114 /* r */  && array[startIndex + 5] === 110 /* n */ ) ? 33 /* ReturnKeyword */  : 11 /* IdentifierName */ ;
                    case 115 /* s */ :
                        switch(array[startIndex + 1]) {
                            case 119 /* w */ :
                                return (array[startIndex + 2] === 105 /* i */  && array[startIndex + 3] === 116 /* t */  && array[startIndex + 4] === 99 /* c */  && array[startIndex + 5] === 104 /* h */ ) ? 34 /* SwitchKeyword */  : 11 /* IdentifierName */ ;
                            case 116 /* t */ :
                                switch(array[startIndex + 2]) {
                                    case 97 /* a */ :
                                        return (array[startIndex + 3] === 116 /* t */  && array[startIndex + 4] === 105 /* i */  && array[startIndex + 5] === 99 /* c */ ) ? 58 /* StaticKeyword */  : 11 /* IdentifierName */ ;
                                    case 114 /* r */ :
                                        return (array[startIndex + 3] === 105 /* i */  && array[startIndex + 4] === 110 /* n */  && array[startIndex + 5] === 103 /* g */ ) ? 69 /* StringKeyword */  : 11 /* IdentifierName */ ;
                                    default:
                                        return 11 /* IdentifierName */ ;
                                }
                            default:
                                return 11 /* IdentifierName */ ;
                        }
                    case 116 /* t */ :
                        return (array[startIndex + 1] === 121 /* y */  && array[startIndex + 2] === 112 /* p */  && array[startIndex + 3] === 101 /* e */  && array[startIndex + 4] === 111 /* o */  && array[startIndex + 5] === 102 /* f */ ) ? 39 /* TypeOfKeyword */  : 11 /* IdentifierName */ ;
                    case 101 /* e */ :
                        return (array[startIndex + 1] === 120 /* x */  && array[startIndex + 2] === 112 /* p */  && array[startIndex + 3] === 111 /* o */  && array[startIndex + 4] === 114 /* r */  && array[startIndex + 5] === 116 /* t */ ) ? 47 /* ExportKeyword */  : 11 /* IdentifierName */ ;
                    case 105 /* i */ :
                        return (array[startIndex + 1] === 109 /* m */  && array[startIndex + 2] === 112 /* p */  && array[startIndex + 3] === 111 /* o */  && array[startIndex + 4] === 114 /* r */  && array[startIndex + 5] === 116 /* t */ ) ? 49 /* ImportKeyword */  : 11 /* IdentifierName */ ;
                    case 112 /* p */ :
                        return (array[startIndex + 1] === 117 /* u */  && array[startIndex + 2] === 98 /* b */  && array[startIndex + 3] === 108 /* l */  && array[startIndex + 4] === 105 /* i */  && array[startIndex + 5] === 99 /* c */ ) ? 57 /* PublicKeyword */  : 11 /* IdentifierName */ ;
                    case 109 /* m */ :
                        return (array[startIndex + 1] === 111 /* o */  && array[startIndex + 2] === 100 /* d */  && array[startIndex + 3] === 117 /* u */  && array[startIndex + 4] === 108 /* l */  && array[startIndex + 5] === 101 /* e */ ) ? 66 /* ModuleKeyword */  : 11 /* IdentifierName */ ;
                    case 110 /* n */ :
                        return (array[startIndex + 1] === 117 /* u */  && array[startIndex + 2] === 109 /* m */  && array[startIndex + 3] === 98 /* b */  && array[startIndex + 4] === 101 /* e */  && array[startIndex + 5] === 114 /* r */ ) ? 67 /* NumberKeyword */  : 11 /* IdentifierName */ ;
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 7:
                switch(array[startIndex]) {
                    case 100 /* d */ :
                        switch(array[startIndex + 1]) {
                            case 101 /* e */ :
                                switch(array[startIndex + 2]) {
                                    case 102 /* f */ :
                                        return (array[startIndex + 3] === 97 /* a */  && array[startIndex + 4] === 117 /* u */  && array[startIndex + 5] === 108 /* l */  && array[startIndex + 6] === 116 /* t */ ) ? 20 /* DefaultKeyword */  : 11 /* IdentifierName */ ;
                                    case 99 /* c */ :
                                        return (array[startIndex + 3] === 108 /* l */  && array[startIndex + 4] === 97 /* a */  && array[startIndex + 5] === 114 /* r */  && array[startIndex + 6] === 101 /* e */ ) ? 64 /* DeclareKeyword */  : 11 /* IdentifierName */ ;
                                    default:
                                        return 11 /* IdentifierName */ ;
                                }
                            default:
                                return 11 /* IdentifierName */ ;
                        }
                    case 102 /* f */ :
                        return (array[startIndex + 1] === 105 /* i */  && array[startIndex + 2] === 110 /* n */  && array[startIndex + 3] === 97 /* a */  && array[startIndex + 4] === 108 /* l */  && array[startIndex + 5] === 108 /* l */  && array[startIndex + 6] === 121 /* y */ ) ? 25 /* FinallyKeyword */  : 11 /* IdentifierName */ ;
                    case 101 /* e */ :
                        return (array[startIndex + 1] === 120 /* x */  && array[startIndex + 2] === 116 /* t */  && array[startIndex + 3] === 101 /* e */  && array[startIndex + 4] === 110 /* n */  && array[startIndex + 5] === 100 /* d */  && array[startIndex + 6] === 115 /* s */ ) ? 48 /* ExtendsKeyword */  : 11 /* IdentifierName */ ;
                    case 112 /* p */ :
                        switch(array[startIndex + 1]) {
                            case 97 /* a */ :
                                return (array[startIndex + 2] === 99 /* c */  && array[startIndex + 3] === 107 /* k */  && array[startIndex + 4] === 97 /* a */  && array[startIndex + 5] === 103 /* g */  && array[startIndex + 6] === 101 /* e */ ) ? 54 /* PackageKeyword */  : 11 /* IdentifierName */ ;
                            case 114 /* r */ :
                                return (array[startIndex + 2] === 105 /* i */  && array[startIndex + 3] === 118 /* v */  && array[startIndex + 4] === 97 /* a */  && array[startIndex + 5] === 116 /* t */  && array[startIndex + 6] === 101 /* e */ ) ? 55 /* PrivateKeyword */  : 11 /* IdentifierName */ ;
                            default:
                                return 11 /* IdentifierName */ ;
                        }
                    case 98 /* b */ :
                        return (array[startIndex + 1] === 111 /* o */  && array[startIndex + 2] === 111 /* o */  && array[startIndex + 3] === 108 /* l */  && array[startIndex + 4] === 101 /* e */  && array[startIndex + 5] === 97 /* a */  && array[startIndex + 6] === 110 /* n */ ) ? 61 /* BooleanKeyword */  : 11 /* IdentifierName */ ;
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 8:
                switch(array[startIndex]) {
                    case 99 /* c */ :
                        return (array[startIndex + 1] === 111 /* o */  && array[startIndex + 2] === 110 /* n */  && array[startIndex + 3] === 116 /* t */  && array[startIndex + 4] === 105 /* i */  && array[startIndex + 5] === 110 /* n */  && array[startIndex + 6] === 117 /* u */  && array[startIndex + 7] === 101 /* e */ ) ? 18 /* ContinueKeyword */  : 11 /* IdentifierName */ ;
                    case 100 /* d */ :
                        return (array[startIndex + 1] === 101 /* e */  && array[startIndex + 2] === 98 /* b */  && array[startIndex + 3] === 117 /* u */  && array[startIndex + 4] === 103 /* g */  && array[startIndex + 5] === 103 /* g */  && array[startIndex + 6] === 101 /* e */  && array[startIndex + 7] === 114 /* r */ ) ? 19 /* DebuggerKeyword */  : 11 /* IdentifierName */ ;
                    case 102 /* f */ :
                        return (array[startIndex + 1] === 117 /* u */  && array[startIndex + 2] === 110 /* n */  && array[startIndex + 3] === 99 /* c */  && array[startIndex + 4] === 116 /* t */  && array[startIndex + 5] === 105 /* i */  && array[startIndex + 6] === 111 /* o */  && array[startIndex + 7] === 110 /* n */ ) ? 27 /* FunctionKeyword */  : 11 /* IdentifierName */ ;
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 9:
                switch(array[startIndex]) {
                    case 105 /* i */ :
                        return (array[startIndex + 1] === 110 /* n */  && array[startIndex + 2] === 116 /* t */  && array[startIndex + 3] === 101 /* e */  && array[startIndex + 4] === 114 /* r */  && array[startIndex + 5] === 102 /* f */  && array[startIndex + 6] === 97 /* a */  && array[startIndex + 7] === 99 /* c */  && array[startIndex + 8] === 101 /* e */ ) ? 52 /* InterfaceKeyword */  : 11 /* IdentifierName */ ;
                    case 112 /* p */ :
                        return (array[startIndex + 1] === 114 /* r */  && array[startIndex + 2] === 111 /* o */  && array[startIndex + 3] === 116 /* t */  && array[startIndex + 4] === 101 /* e */  && array[startIndex + 5] === 99 /* c */  && array[startIndex + 6] === 116 /* t */  && array[startIndex + 7] === 101 /* e */  && array[startIndex + 8] === 100 /* d */ ) ? 56 /* ProtectedKeyword */  : 11 /* IdentifierName */ ;
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 10:
                switch(array[startIndex]) {
                    case 105 /* i */ :
                        switch(array[startIndex + 1]) {
                            case 110 /* n */ :
                                return (array[startIndex + 2] === 115 /* s */  && array[startIndex + 3] === 116 /* t */  && array[startIndex + 4] === 97 /* a */  && array[startIndex + 5] === 110 /* n */  && array[startIndex + 6] === 99 /* c */  && array[startIndex + 7] === 101 /* e */  && array[startIndex + 8] === 111 /* o */  && array[startIndex + 9] === 102 /* f */ ) ? 30 /* InstanceOfKeyword */  : 11 /* IdentifierName */ ;
                            case 109 /* m */ :
                                return (array[startIndex + 2] === 112 /* p */  && array[startIndex + 3] === 108 /* l */  && array[startIndex + 4] === 101 /* e */  && array[startIndex + 5] === 109 /* m */  && array[startIndex + 6] === 101 /* e */  && array[startIndex + 7] === 110 /* n */  && array[startIndex + 8] === 116 /* t */  && array[startIndex + 9] === 115 /* s */ ) ? 51 /* ImplementsKeyword */  : 11 /* IdentifierName */ ;
                            default:
                                return 11 /* IdentifierName */ ;
                        }
                    default:
                        return 11 /* IdentifierName */ ;
                }
            case 11:
                return (array[startIndex] === 99 /* c */  && array[startIndex + 1] === 111 /* o */  && array[startIndex + 2] === 110 /* n */  && array[startIndex + 3] === 115 /* s */  && array[startIndex + 4] === 116 /* t */  && array[startIndex + 5] === 114 /* r */  && array[startIndex + 6] === 117 /* u */  && array[startIndex + 7] === 99 /* c */  && array[startIndex + 8] === 116 /* t */  && array[startIndex + 9] === 111 /* o */  && array[startIndex + 10] === 114 /* r */ ) ? 63 /* ConstructorKeyword */  : 11 /* IdentifierName */ ;
            default:
                return 11 /* IdentifierName */ ;
        }
    };
    return ScannerUtilities;
})();
var StringUtilities = (function () {
    function StringUtilities() { }
    StringUtilities.fromCharCodeArray = function fromCharCodeArray(array) {
        return String.fromCharCode.apply(null, array);
    };
    StringUtilities.endsWith = function endsWith(string, value) {
        return string.substring(string.length - value.length, string.length) === value;
    };
    StringUtilities.startsWith = function startsWith(string, value) {
        return string.substr(0, value.length) === value;
    };
    StringUtilities.copyTo = function copyTo(source, sourceIndex, destination, destinationIndex, count) {
        for(var i = 0; i < count; i++) {
            destination[destinationIndex + i] = source.charCodeAt(sourceIndex + i);
        }
    };
    StringUtilities.repeat = function repeat(value, count) {
        return Array(count + 1).join(value);
    };
    return StringUtilities;
})();
var Collections;
(function (Collections) {
    Collections.DefaultStringTableCapacity = 256;
    var StringTableEntry = (function () {
        function StringTableEntry(Text, HashCode, Next) {
            this.Text = Text;
            this.HashCode = HashCode;
            this.Next = Next;
        }
        return StringTableEntry;
    })();    
    var StringTable = (function () {
        function StringTable(capacity) {
            this.entries = [];
            this.count = 0;
            var size = Hash.getPrime(capacity);
            this.entries = ArrayUtilities.createArray(size);
        }
        StringTable.prototype.addCharArray = function (key, start, len) {
            var hashCode = Hash.computeSimple31BitCharArrayHashCode(key, start, len) & 2147483647;
            Debug.assert(hashCode > 0);
            var entry = this.findCharArrayEntry(key, start, len, hashCode);
            if(entry !== null) {
                return entry.Text;
            }
            var slice = key.slice(start, start + len);
            return this.addEntry(StringUtilities.fromCharCodeArray(slice), hashCode);
        };
        StringTable.prototype.findCharArrayEntry = function (key, start, len, hashCode) {
            for(var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
                if(e.HashCode === hashCode && StringTable.textCharArrayEquals(e.Text, key, start, len)) {
                    return e;
                }
            }
            return null;
        };
        StringTable.prototype.addEntry = function (text, hashCode) {
            var index = hashCode % this.entries.length;
            var e = new StringTableEntry(text, hashCode, this.entries[index]);
            this.entries[index] = e;
            if(this.count === this.entries.length) {
                this.grow();
            }
            this.count++;
            return e.Text;
        };
        StringTable.prototype.grow = function () {
            var newSize = Hash.expandPrime(this.entries.length);
            var oldEntries = this.entries;
            var newEntries = ArrayUtilities.createArray(newSize);
            this.entries = newEntries;
            for(var i = 0; i < oldEntries.length; i++) {
                var e = oldEntries[i];
                while(e !== null) {
                    var newIndex = e.HashCode % newSize;
                    var tmp = e.Next;
                    e.Next = newEntries[newIndex];
                    newEntries[newIndex] = e;
                    e = tmp;
                }
            }
        };
        StringTable.textCharArrayEquals = function textCharArrayEquals(text, array, start, length) {
            if(text.length !== length) {
                return false;
            }
            var s = start;
            for(var i = 0; i < length; i++) {
                if(text.charCodeAt(i) !== array[s]) {
                    return false;
                }
                s++;
            }
            return true;
        };
        return StringTable;
    })();
    Collections.StringTable = StringTable;    
    function createStringTable(capacity) {
        if (typeof capacity === "undefined") { capacity = Collections.DefaultStringTableCapacity; }
        return new StringTable(capacity);
    }
    Collections.createStringTable = createStringTable;
})(Collections || (Collections = {}));
var DiagnosticCode;
(function (DiagnosticCode) {
    DiagnosticCode._map = [];
    DiagnosticCode._map[0] = "Unrecognized_escape_sequence";
    DiagnosticCode.Unrecognized_escape_sequence = 0;
    DiagnosticCode._map[1] = "Unexpected_character_0";
    DiagnosticCode.Unexpected_character_0 = 1;
    DiagnosticCode._map[2] = "Missing_closing_quote_character";
    DiagnosticCode.Missing_closing_quote_character = 2;
    DiagnosticCode._map[3] = "Identifier_expected";
    DiagnosticCode.Identifier_expected = 3;
    DiagnosticCode._map[4] = "_0_keyword_expected";
    DiagnosticCode._0_keyword_expected = 4;
    DiagnosticCode._map[5] = "_0_expected";
    DiagnosticCode._0_expected = 5;
    DiagnosticCode._map[6] = "Identifier_expected__0_is_a_keyword";
    DiagnosticCode.Identifier_expected__0_is_a_keyword = 6;
    DiagnosticCode._map[7] = "Automatic_semicolon_insertion_not_allowed";
    DiagnosticCode.Automatic_semicolon_insertion_not_allowed = 7;
    DiagnosticCode._map[8] = "Unexpected_token__0_expected";
    DiagnosticCode.Unexpected_token__0_expected = 8;
    DiagnosticCode._map[9] = "Trailing_separator_not_allowed";
    DiagnosticCode.Trailing_separator_not_allowed = 9;
    DiagnosticCode._map[10] = "_StarSlash__expected";
    DiagnosticCode._StarSlash__expected = 10;
})(DiagnosticCode || (DiagnosticCode = {}));
var DiagnosticMessages = (function () {
    function DiagnosticMessages() { }
    DiagnosticMessages.codeToFormatString = [];
    DiagnosticMessages.initializeStaticData = function initializeStaticData() {
        if(DiagnosticMessages.codeToFormatString.length === 0) {
            DiagnosticMessages.codeToFormatString[0 /* Unrecognized_escape_sequence */ ] = "Unrecognized escape sequence.";
            DiagnosticMessages.codeToFormatString[1 /* Unexpected_character_0 */ ] = "Unexpected character {0}.";
            DiagnosticMessages.codeToFormatString[2 /* Missing_closing_quote_character */ ] = "Missing close quote character.";
            DiagnosticMessages.codeToFormatString[3 /* Identifier_expected */ ] = "Identifier expected.";
            DiagnosticMessages.codeToFormatString[4 /* _0_keyword_expected */ ] = "'{0}' keyword expected.";
            DiagnosticMessages.codeToFormatString[5 /* _0_expected */ ] = "'{0}' expected.";
            DiagnosticMessages.codeToFormatString[6 /* Identifier_expected__0_is_a_keyword */ ] = "Identifier expected; '{0}' is a keyword.";
            DiagnosticMessages.codeToFormatString[7 /* Automatic_semicolon_insertion_not_allowed */ ] = "Automatic semicolon insertion not allowed.";
            DiagnosticMessages.codeToFormatString[8 /* Unexpected_token__0_expected */ ] = "Unexpected token; '{0}' expected.";
            DiagnosticMessages.codeToFormatString[9 /* Trailing_separator_not_allowed */ ] = "Trailing separator not allowed.";
            DiagnosticMessages.codeToFormatString[10 /* _StarSlash__expected */ ] = "'*/' expected.";
        }
    };
    DiagnosticMessages.getFormatString = function getFormatString(code) {
        DiagnosticMessages.initializeStaticData();
        return DiagnosticMessages.codeToFormatString[code];
    };
    DiagnosticMessages.getDiagnosticMessage = function getDiagnosticMessage(code, args) {
        var formatString = DiagnosticMessages.getFormatString(code);
        var result = formatString.replace(/{(\d+)}/g, function (match, num) {
            return typeof args[num] !== 'undefined' ? args[num] : match;
        });
        return result;
    };
    return DiagnosticMessages;
})();
var Diagnostic = (function () {
    function Diagnostic(diagnosticCode, _arguments) {
        this._diagnosticCode = diagnosticCode;
        this._arguments = (_arguments && _arguments.length > 0) ? _arguments : null;
    }
    Diagnostic.prototype.diagnosticCode = function () {
        return this._diagnosticCode;
    };
    Diagnostic.prototype.additionalLocations = function () {
        return [];
    };
    Diagnostic.prototype.message = function () {
        return DiagnosticMessages.getDiagnosticMessage(this._diagnosticCode, this._arguments);
    };
    Diagnostic.equals = function equals(diagnostic1, diagnostic2) {
        return diagnostic1._diagnosticCode === diagnostic2._diagnosticCode && ArrayUtilities.sequenceEquals(diagnostic1._arguments, diagnostic2._arguments, function (v1, v2) {
            return v1 === v2;
        });
    };
    return Diagnostic;
})();
var SyntaxDiagnostic = (function (_super) {
    __extends(SyntaxDiagnostic, _super);
    function SyntaxDiagnostic(position, width, code, args) {
        _super.call(this, code, args);
        if(width < 0) {
            throw Errors.argumentOutOfRange("width");
        }
        this._position = position;
        this._width = width;
    }
    SyntaxDiagnostic.prototype.toJSON = function (key) {
        var result = {
        };
        result._position = this._position;
        result._width = this._width;
        result._diagnosticCode = (DiagnosticCode)._map[this.diagnosticCode()];
        var arguments = (this)._arguments;
        if(arguments && arguments.length > 0) {
            result._arguments = arguments;
        }
        return result;
    };
    SyntaxDiagnostic.prototype.position = function () {
        return this._position;
    };
    SyntaxDiagnostic.prototype.width = function () {
        return this._width;
    };
    SyntaxDiagnostic.equals = function equals(diagnostic1, diagnostic2) {
        return diagnostic1._position === diagnostic2._position && diagnostic1._width === diagnostic2._width && Diagnostic.equals(diagnostic1, diagnostic2);
    };
    return SyntaxDiagnostic;
})(Diagnostic);
var Syntax;
(function (Syntax) {
    var VariableWidthTokenWithNoTrivia = (function () {
        function VariableWidthTokenWithNoTrivia(sourceText, fullStart, kind, textOrWidth) {
            this._value = null;
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._textOrWidth = textOrWidth;
        }
        VariableWidthTokenWithNoTrivia.prototype.clone = function () {
            return new VariableWidthTokenWithNoTrivia(this._sourceText, this._fullStart, this.tokenKind, this._textOrWidth);
        };
        VariableWidthTokenWithNoTrivia.prototype.isNode = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.isToken = function () {
            return true;
        };
        VariableWidthTokenWithNoTrivia.prototype.isList = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        VariableWidthTokenWithNoTrivia.prototype.childCount = function () {
            return 0;
        };
        VariableWidthTokenWithNoTrivia.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange('index');
        };
        VariableWidthTokenWithNoTrivia.prototype.fullWidth = function () {
            return this.width();
        };
        VariableWidthTokenWithNoTrivia.prototype.start = function () {
            return this._fullStart;
        };
        VariableWidthTokenWithNoTrivia.prototype.end = function () {
            return this.start() + this.width();
        };
        VariableWidthTokenWithNoTrivia.prototype.width = function () {
            return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length;
        };
        VariableWidthTokenWithNoTrivia.prototype.text = function () {
            if(typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(this.start(), this._textOrWidth, this.tokenKind === 11 /* IdentifierName */ );
            }
            return this._textOrWidth;
        };
        VariableWidthTokenWithNoTrivia.prototype.fullText = function () {
            return this._sourceText.substr(this._fullStart, this.fullWidth(), false);
        };
        VariableWidthTokenWithNoTrivia.prototype.value = function () {
            return this._value || (this._value = Syntax.value(this));
        };
        VariableWidthTokenWithNoTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasLeadingComment = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasLeadingNewLine = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.leadingTriviaWidth = function () {
            return 0;
        };
        VariableWidthTokenWithNoTrivia.prototype.leadingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasTrailingComment = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasTrailingNewLine = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.trailingTriviaWidth = function () {
            return 0;
        };
        VariableWidthTokenWithNoTrivia.prototype.trailingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.toJSON = function (key) {
            return Syntax.tokenToJSON(this);
        };
        VariableWidthTokenWithNoTrivia.prototype.firstToken = function () {
            return this;
        };
        VariableWidthTokenWithNoTrivia.prototype.lastToken = function () {
            return this;
        };
        VariableWidthTokenWithNoTrivia.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        VariableWidthTokenWithNoTrivia.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        VariableWidthTokenWithNoTrivia.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        VariableWidthTokenWithNoTrivia.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        VariableWidthTokenWithNoTrivia.prototype.realize = function () {
            return Syntax.realize(this);
        };
        VariableWidthTokenWithNoTrivia.prototype.collectTextElements = function (elements) {
            collectTokenTextElements(this, elements);
        };
        VariableWidthTokenWithNoTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        VariableWidthTokenWithNoTrivia.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        VariableWidthTokenWithNoTrivia.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return VariableWidthTokenWithNoTrivia;
    })();
    Syntax.VariableWidthTokenWithNoTrivia = VariableWidthTokenWithNoTrivia;    
    var VariableWidthTokenWithLeadingTrivia = (function () {
        function VariableWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, textOrWidth) {
            this._value = null;
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._textOrWidth = textOrWidth;
        }
        VariableWidthTokenWithLeadingTrivia.prototype.clone = function () {
            return new VariableWidthTokenWithLeadingTrivia(this._sourceText, this._fullStart, this.tokenKind, this._leadingTriviaInfo, this._textOrWidth);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isNode = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isToken = function () {
            return true;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isList = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.childCount = function () {
            return 0;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange('index');
        };
        VariableWidthTokenWithLeadingTrivia.prototype.fullWidth = function () {
            return getTriviaWidth(this._leadingTriviaInfo) + this.width();
        };
        VariableWidthTokenWithLeadingTrivia.prototype.start = function () {
            return this._fullStart + getTriviaWidth(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.end = function () {
            return this.start() + this.width();
        };
        VariableWidthTokenWithLeadingTrivia.prototype.width = function () {
            return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.text = function () {
            if(typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(this.start(), this._textOrWidth, this.tokenKind === 11 /* IdentifierName */ );
            }
            return this._textOrWidth;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.fullText = function () {
            return this._sourceText.substr(this._fullStart, this.fullWidth(), false);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.value = function () {
            return this._value || (this._value = Syntax.value(this));
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasLeadingComment = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasLeadingNewLine = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.leadingTriviaWidth = function () {
            return getTriviaWidth(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.leadingTrivia = function () {
            return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), false);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasTrailingComment = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasTrailingNewLine = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.trailingTriviaWidth = function () {
            return 0;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.trailingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.toJSON = function (key) {
            return Syntax.tokenToJSON(this);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.firstToken = function () {
            return this;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.lastToken = function () {
            return this;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        VariableWidthTokenWithLeadingTrivia.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.realize = function () {
            return Syntax.realize(this);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.collectTextElements = function (elements) {
            collectTokenTextElements(this, elements);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        VariableWidthTokenWithLeadingTrivia.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return VariableWidthTokenWithLeadingTrivia;
    })();
    Syntax.VariableWidthTokenWithLeadingTrivia = VariableWidthTokenWithLeadingTrivia;    
    var VariableWidthTokenWithTrailingTrivia = (function () {
        function VariableWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, textOrWidth, trailingTriviaInfo) {
            this._value = null;
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._textOrWidth = textOrWidth;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        VariableWidthTokenWithTrailingTrivia.prototype.clone = function () {
            return new VariableWidthTokenWithTrailingTrivia(this._sourceText, this._fullStart, this.tokenKind, this._textOrWidth, this._trailingTriviaInfo);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isList = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.childCount = function () {
            return 0;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange('index');
        };
        VariableWidthTokenWithTrailingTrivia.prototype.fullWidth = function () {
            return this.width() + getTriviaWidth(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.start = function () {
            return this._fullStart;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.end = function () {
            return this.start() + this.width();
        };
        VariableWidthTokenWithTrailingTrivia.prototype.width = function () {
            return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.text = function () {
            if(typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(this.start(), this._textOrWidth, this.tokenKind === 11 /* IdentifierName */ );
            }
            return this._textOrWidth;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.fullText = function () {
            return this._sourceText.substr(this._fullStart, this.fullWidth(), false);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.value = function () {
            return this._value || (this._value = Syntax.value(this));
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasLeadingComment = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasLeadingNewLine = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.leadingTriviaWidth = function () {
            return 0;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.leadingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasTrailingComment = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasTrailingNewLine = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.trailingTriviaWidth = function () {
            return getTriviaWidth(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.trailingTrivia = function () {
            return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), true);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.toJSON = function (key) {
            return Syntax.tokenToJSON(this);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.firstToken = function () {
            return this;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.lastToken = function () {
            return this;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        VariableWidthTokenWithTrailingTrivia.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.realize = function () {
            return Syntax.realize(this);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.collectTextElements = function (elements) {
            collectTokenTextElements(this, elements);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        VariableWidthTokenWithTrailingTrivia.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return VariableWidthTokenWithTrailingTrivia;
    })();
    Syntax.VariableWidthTokenWithTrailingTrivia = VariableWidthTokenWithTrailingTrivia;    
    var VariableWidthTokenWithLeadingAndTrailingTrivia = (function () {
        function VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, textOrWidth, trailingTriviaInfo) {
            this._value = null;
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._textOrWidth = textOrWidth;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.clone = function () {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(this._sourceText, this._fullStart, this.tokenKind, this._leadingTriviaInfo, this._textOrWidth, this._trailingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isList = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.childCount = function () {
            return 0;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange('index');
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.fullWidth = function () {
            return getTriviaWidth(this._leadingTriviaInfo) + this.width() + getTriviaWidth(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.start = function () {
            return this._fullStart + getTriviaWidth(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.end = function () {
            return this.start() + this.width();
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.width = function () {
            return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.text = function () {
            if(typeof this._textOrWidth === 'number') {
                this._textOrWidth = this._sourceText.substr(this.start(), this._textOrWidth, this.tokenKind === 11 /* IdentifierName */ );
            }
            return this._textOrWidth;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.fullText = function () {
            return this._sourceText.substr(this._fullStart, this.fullWidth(), false);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.value = function () {
            return this._value || (this._value = Syntax.value(this));
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingComment = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingNewLine = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.leadingTriviaWidth = function () {
            return getTriviaWidth(this._leadingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.leadingTrivia = function () {
            return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), false);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingComment = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingNewLine = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.trailingTriviaWidth = function () {
            return getTriviaWidth(this._trailingTriviaInfo);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.trailingTrivia = function () {
            return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), true);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasSkippedText = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.toJSON = function (key) {
            return Syntax.tokenToJSON(this);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.firstToken = function () {
            return this;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.lastToken = function () {
            return this;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.realize = function () {
            return Syntax.realize(this);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.collectTextElements = function (elements) {
            collectTokenTextElements(this, elements);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        VariableWidthTokenWithLeadingAndTrailingTrivia.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return VariableWidthTokenWithLeadingAndTrailingTrivia;
    })();
    Syntax.VariableWidthTokenWithLeadingAndTrailingTrivia = VariableWidthTokenWithLeadingAndTrailingTrivia;    
    var FixedWidthTokenWithNoTrivia = (function () {
        function FixedWidthTokenWithNoTrivia(kind) {
            this.tokenKind = kind;
        }
        FixedWidthTokenWithNoTrivia.prototype.clone = function () {
            return new FixedWidthTokenWithNoTrivia(this.tokenKind);
        };
        FixedWidthTokenWithNoTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthTokenWithNoTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        FixedWidthTokenWithNoTrivia.prototype.childCount = function () {
            return 0;
        };
        FixedWidthTokenWithNoTrivia.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange('index');
        };
        FixedWidthTokenWithNoTrivia.prototype.fullWidth = function () {
            return this.width();
        };
        FixedWidthTokenWithNoTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthTokenWithNoTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this.tokenKind);
        };
        FixedWidthTokenWithNoTrivia.prototype.fullText = function () {
            return this.text();
        };
        FixedWidthTokenWithNoTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasLeadingComment = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasLeadingNewLine = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.leadingTriviaWidth = function () {
            return 0;
        };
        FixedWidthTokenWithNoTrivia.prototype.leadingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasTrailingComment = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasTrailingNewLine = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.trailingTriviaWidth = function () {
            return 0;
        };
        FixedWidthTokenWithNoTrivia.prototype.trailingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.toJSON = function (key) {
            return Syntax.tokenToJSON(this);
        };
        FixedWidthTokenWithNoTrivia.prototype.firstToken = function () {
            return this;
        };
        FixedWidthTokenWithNoTrivia.prototype.lastToken = function () {
            return this;
        };
        FixedWidthTokenWithNoTrivia.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        FixedWidthTokenWithNoTrivia.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        FixedWidthTokenWithNoTrivia.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        FixedWidthTokenWithNoTrivia.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        FixedWidthTokenWithNoTrivia.prototype.realize = function () {
            return Syntax.realize(this);
        };
        FixedWidthTokenWithNoTrivia.prototype.collectTextElements = function (elements) {
            collectTokenTextElements(this, elements);
        };
        FixedWidthTokenWithNoTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        FixedWidthTokenWithNoTrivia.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        FixedWidthTokenWithNoTrivia.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return FixedWidthTokenWithNoTrivia;
    })();
    Syntax.FixedWidthTokenWithNoTrivia = FixedWidthTokenWithNoTrivia;    
    var FixedWidthTokenWithLeadingTrivia = (function () {
        function FixedWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._leadingTriviaInfo = leadingTriviaInfo;
        }
        FixedWidthTokenWithLeadingTrivia.prototype.clone = function () {
            return new FixedWidthTokenWithLeadingTrivia(this._sourceText, this._fullStart, this.tokenKind, this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.childCount = function () {
            return 0;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange('index');
        };
        FixedWidthTokenWithLeadingTrivia.prototype.fullWidth = function () {
            return getTriviaWidth(this._leadingTriviaInfo) + this.width();
        };
        FixedWidthTokenWithLeadingTrivia.prototype.start = function () {
            return this._fullStart + getTriviaWidth(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.end = function () {
            return this.start() + this.width();
        };
        FixedWidthTokenWithLeadingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this.tokenKind);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.fullText = function () {
            return this._sourceText.substr(this._fullStart, this.fullWidth(), false);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasLeadingComment = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasLeadingNewLine = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.leadingTriviaWidth = function () {
            return getTriviaWidth(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.leadingTrivia = function () {
            return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), false);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasTrailingTrivia = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasTrailingComment = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasTrailingNewLine = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.trailingTriviaWidth = function () {
            return 0;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.trailingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.toJSON = function (key) {
            return Syntax.tokenToJSON(this);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.firstToken = function () {
            return this;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.lastToken = function () {
            return this;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        FixedWidthTokenWithLeadingTrivia.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.realize = function () {
            return Syntax.realize(this);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.collectTextElements = function (elements) {
            collectTokenTextElements(this, elements);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        FixedWidthTokenWithLeadingTrivia.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return FixedWidthTokenWithLeadingTrivia;
    })();
    Syntax.FixedWidthTokenWithLeadingTrivia = FixedWidthTokenWithLeadingTrivia;    
    var FixedWidthTokenWithTrailingTrivia = (function () {
        function FixedWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, trailingTriviaInfo) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        FixedWidthTokenWithTrailingTrivia.prototype.clone = function () {
            return new FixedWidthTokenWithTrailingTrivia(this._sourceText, this._fullStart, this.tokenKind, this._trailingTriviaInfo);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.childCount = function () {
            return 0;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange('index');
        };
        FixedWidthTokenWithTrailingTrivia.prototype.fullWidth = function () {
            return this.width() + getTriviaWidth(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.start = function () {
            return this._fullStart;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.end = function () {
            return this.start() + this.width();
        };
        FixedWidthTokenWithTrailingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this.tokenKind);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.fullText = function () {
            return this._sourceText.substr(this._fullStart, this.fullWidth(), false);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasLeadingComment = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasLeadingNewLine = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.leadingTriviaWidth = function () {
            return 0;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.leadingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasTrailingComment = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasTrailingNewLine = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.trailingTriviaWidth = function () {
            return getTriviaWidth(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.trailingTrivia = function () {
            return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), true);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.toJSON = function (key) {
            return Syntax.tokenToJSON(this);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.firstToken = function () {
            return this;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.lastToken = function () {
            return this;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        FixedWidthTokenWithTrailingTrivia.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.realize = function () {
            return Syntax.realize(this);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.collectTextElements = function (elements) {
            collectTokenTextElements(this, elements);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        FixedWidthTokenWithTrailingTrivia.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return FixedWidthTokenWithTrailingTrivia;
    })();
    Syntax.FixedWidthTokenWithTrailingTrivia = FixedWidthTokenWithTrailingTrivia;    
    var FixedWidthTokenWithLeadingAndTrailingTrivia = (function () {
        function FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo) {
            this._sourceText = sourceText;
            this._fullStart = fullStart;
            this.tokenKind = kind;
            this._leadingTriviaInfo = leadingTriviaInfo;
            this._trailingTriviaInfo = trailingTriviaInfo;
        }
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.clone = function () {
            return new FixedWidthTokenWithLeadingAndTrailingTrivia(this._sourceText, this._fullStart, this.tokenKind, this._leadingTriviaInfo, this._trailingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isNode = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isToken = function () {
            return true;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isList = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isSeparatedList = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.kind = function () {
            return this.tokenKind;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.childCount = function () {
            return 0;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange('index');
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.fullWidth = function () {
            return getTriviaWidth(this._leadingTriviaInfo) + this.width() + getTriviaWidth(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.start = function () {
            return this._fullStart + getTriviaWidth(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.end = function () {
            return this.start() + this.width();
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.width = function () {
            return this.text().length;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.text = function () {
            return SyntaxFacts.getText(this.tokenKind);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.fullText = function () {
            return this._sourceText.substr(this._fullStart, this.fullWidth(), false);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.value = function () {
            return null;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingTrivia = function () {
            return true;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingComment = function () {
            return hasTriviaComment(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingNewLine = function () {
            return hasTriviaNewLine(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.leadingTriviaWidth = function () {
            return getTriviaWidth(this._leadingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.leadingTrivia = function () {
            return Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), false);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingTrivia = function () {
            return true;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingComment = function () {
            return hasTriviaComment(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingNewLine = function () {
            return hasTriviaNewLine(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.trailingTriviaWidth = function () {
            return getTriviaWidth(this._trailingTriviaInfo);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.trailingTrivia = function () {
            return Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), true);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasSkippedText = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.toJSON = function (key) {
            return Syntax.tokenToJSON(this);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.firstToken = function () {
            return this;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.lastToken = function () {
            return this;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.realize = function () {
            return Syntax.realize(this);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.collectTextElements = function (elements) {
            collectTokenTextElements(this, elements);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        FixedWidthTokenWithLeadingAndTrailingTrivia.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return FixedWidthTokenWithLeadingAndTrailingTrivia;
    })();
    Syntax.FixedWidthTokenWithLeadingAndTrailingTrivia = FixedWidthTokenWithLeadingAndTrailingTrivia;    
    function collectTokenTextElements(token, elements) {
        token.leadingTrivia().collectTextElements(elements);
        elements.push(token.text());
        token.trailingTrivia().collectTextElements(elements);
    }
    function fixedWidthToken(sourceText, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo) {
        if(leadingTriviaInfo === 0) {
            if(trailingTriviaInfo === 0) {
                return new FixedWidthTokenWithNoTrivia(kind);
            } else {
                return new FixedWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, trailingTriviaInfo);
            }
        } else if(trailingTriviaInfo === 0) {
            return new FixedWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo);
        } else {
            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);
        }
    }
    Syntax.fixedWidthToken = fixedWidthToken;
    function variableWidthToken(sourceText, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo) {
        if(leadingTriviaInfo === 0) {
            if(trailingTriviaInfo === 0) {
                return new VariableWidthTokenWithNoTrivia(sourceText, fullStart, kind, width);
            } else {
                return new VariableWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, width, trailingTriviaInfo);
            }
        } else if(trailingTriviaInfo === 0) {
            return new VariableWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width);
        } else {
            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);
        }
    }
    Syntax.variableWidthToken = variableWidthToken;
    function getTriviaWidth(value) {
        return value >>> 2 /* TriviaFullWidthShift */ ;
    }
    function hasTriviaComment(value) {
        return (value & 2 /* TriviaCommentMask */ ) !== 0;
    }
    function hasTriviaNewLine(value) {
        return (value & 1 /* TriviaNewLineMask */ ) !== 0;
    }
})(Syntax || (Syntax = {}));
var Syntax;
(function (Syntax) {
    var SyntaxTrivia = (function () {
        function SyntaxTrivia(kind, text) {
            this._kind = kind;
            this._text = text;
        }
        SyntaxTrivia.prototype.toJSON = function (key) {
            var result = {
            };
            result.kind = (SyntaxKind)._map[this._kind];
            result.text = this._text;
            return result;
        };
        SyntaxTrivia.prototype.kind = function () {
            return this._kind;
        };
        SyntaxTrivia.prototype.fullWidth = function () {
            return this._text.length;
        };
        SyntaxTrivia.prototype.fullText = function () {
            return this._text;
        };
        SyntaxTrivia.prototype.isWhitespace = function () {
            return this.kind() === 4 /* WhitespaceTrivia */ ;
        };
        SyntaxTrivia.prototype.isComment = function () {
            return this.kind() === 7 /* SingleLineCommentTrivia */  || this.kind() === 6 /* MultiLineCommentTrivia */ ;
        };
        SyntaxTrivia.prototype.isNewLine = function () {
            return this.kind() === 5 /* NewLineTrivia */ ;
        };
        SyntaxTrivia.prototype.isSkippedText = function () {
            return this.kind() === 8 /* SkippedTextTrivia */ ;
        };
        SyntaxTrivia.prototype.collectTextElements = function (elements) {
            elements.push(this.fullText());
        };
        return SyntaxTrivia;
    })();    
    function trivia(kind, text) {
        Debug.assert(kind === 6 /* MultiLineCommentTrivia */  || kind === 5 /* NewLineTrivia */  || kind === 7 /* SingleLineCommentTrivia */  || kind === 4 /* WhitespaceTrivia */  || kind === 8 /* SkippedTextTrivia */ );
        Debug.assert(text.length > 0);
        return new SyntaxTrivia(kind, text);
    }
    Syntax.trivia = trivia;
    function spaces(count) {
        return trivia(4 /* WhitespaceTrivia */ , StringUtilities.repeat(" ", count));
    }
    Syntax.spaces = spaces;
    function whitespace(text) {
        return trivia(4 /* WhitespaceTrivia */ , text);
    }
    Syntax.whitespace = whitespace;
    function multiLineComment(text) {
        return trivia(6 /* MultiLineCommentTrivia */ , text);
    }
    Syntax.multiLineComment = multiLineComment;
    function singleLineComment(text) {
        return trivia(7 /* SingleLineCommentTrivia */ , text);
    }
    Syntax.singleLineComment = singleLineComment;
    Syntax.spaceTrivia = spaces(1);
    Syntax.lineFeedTrivia = trivia(5 /* NewLineTrivia */ , "\n");
    Syntax.carriageReturnTrivia = trivia(5 /* NewLineTrivia */ , "\r");
    Syntax.carriageReturnLineFeedTrivia = trivia(5 /* NewLineTrivia */ , "\r\n");
    function splitMultiLineCommentTriviaIntoMultipleLines(trivia) {
        Debug.assert(trivia.kind() === 6 /* MultiLineCommentTrivia */ );
        var result = [];
        var triviaText = trivia.fullText();
        var currentIndex = 0;
        for(var i = 0; i < triviaText.length; i++) {
            var ch = triviaText.charCodeAt(i);
            var isCarriageReturnLineFeed = false;
            switch(ch) {
                case 13 /* carriageReturn */ :
                    if(i < triviaText.length - 1 && triviaText.charCodeAt(i + 1) === 10 /* lineFeed */ ) {
                        i++;
                    }
                case 10 /* lineFeed */ :
                case 8233 /* paragraphSeparator */ :
                case 8232 /* lineSeparator */ :
                    result.push(triviaText.substring(currentIndex, i + 1));
                    currentIndex = i + 1;
                    continue;
            }
        }
        result.push(triviaText.substring(currentIndex));
        return result;
    }
    Syntax.splitMultiLineCommentTriviaIntoMultipleLines = splitMultiLineCommentTriviaIntoMultipleLines;
})(Syntax || (Syntax = {}));
var Syntax;
(function (Syntax) {
    Syntax.emptyTriviaList = {
        kind: function () {
            return 3 /* TriviaList */ ;
        },
        count: function () {
            return 0;
        },
        syntaxTriviaAt: function (index) {
            throw Errors.argumentOutOfRange("index");
        },
        last: function () {
            throw Errors.argumentOutOfRange("index");
        },
        fullWidth: function () {
            return 0;
        },
        fullText: function () {
            return "";
        },
        hasComment: function () {
            return false;
        },
        hasNewLine: function () {
            return false;
        },
        hasSkippedText: function () {
            return false;
        },
        toJSON: function (key) {
            return [];
        },
        collectTextElements: function (elements) {
        },
        toArray: function () {
            return [];
        },
        concat: function (trivia) {
            return trivia;
        }
    };
    function concatTrivia(list1, list2) {
        if(list1.count() === 0) {
            return list2;
        }
        if(list2.count() === 0) {
            return list1;
        }
        var trivia = list1.toArray();
        trivia.push.apply(trivia, list2.toArray());
        return triviaList(trivia);
    }
    function isComment(trivia) {
        return trivia.kind() === 6 /* MultiLineCommentTrivia */  || trivia.kind() === 7 /* SingleLineCommentTrivia */ ;
    }
    var SingletonSyntaxTriviaList = (function () {
        function SingletonSyntaxTriviaList(item) {
            this.item = item;
        }
        SingletonSyntaxTriviaList.prototype.kind = function () {
            return 3 /* TriviaList */ ;
        };
        SingletonSyntaxTriviaList.prototype.count = function () {
            return 1;
        };
        SingletonSyntaxTriviaList.prototype.syntaxTriviaAt = function (index) {
            if(index !== 0) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.item;
        };
        SingletonSyntaxTriviaList.prototype.last = function () {
            return this.item;
        };
        SingletonSyntaxTriviaList.prototype.fullWidth = function () {
            return this.item.fullWidth();
        };
        SingletonSyntaxTriviaList.prototype.fullText = function () {
            return this.item.fullText();
        };
        SingletonSyntaxTriviaList.prototype.hasComment = function () {
            return isComment(this.item);
        };
        SingletonSyntaxTriviaList.prototype.hasNewLine = function () {
            return this.item.kind() === 5 /* NewLineTrivia */ ;
        };
        SingletonSyntaxTriviaList.prototype.hasSkippedText = function () {
            return this.item.kind() === 8 /* SkippedTextTrivia */ ;
        };
        SingletonSyntaxTriviaList.prototype.toJSON = function (key) {
            return [
                this.item
            ];
        };
        SingletonSyntaxTriviaList.prototype.collectTextElements = function (elements) {
            (this.item).collectTextElements(elements);
        };
        SingletonSyntaxTriviaList.prototype.toArray = function () {
            return [
                this.item
            ];
        };
        SingletonSyntaxTriviaList.prototype.concat = function (trivia) {
            return concatTrivia(this, trivia);
        };
        return SingletonSyntaxTriviaList;
    })();    
    var NormalSyntaxTriviaList = (function () {
        function NormalSyntaxTriviaList(trivia) {
            this.trivia = trivia;
        }
        NormalSyntaxTriviaList.prototype.kind = function () {
            return 3 /* TriviaList */ ;
        };
        NormalSyntaxTriviaList.prototype.count = function () {
            return this.trivia.length;
        };
        NormalSyntaxTriviaList.prototype.syntaxTriviaAt = function (index) {
            if(index < 0 || index >= this.trivia.length) {
                throw Errors.argumentOutOfRange("index");
            }
            return this.trivia[index];
        };
        NormalSyntaxTriviaList.prototype.last = function () {
            return this.trivia[this.trivia.length - 1];
        };
        NormalSyntaxTriviaList.prototype.fullWidth = function () {
            return ArrayUtilities.sum(this.trivia, function (t) {
                return t.fullWidth();
            });
        };
        NormalSyntaxTriviaList.prototype.fullText = function () {
            var result = "";
            for(var i = 0, n = this.trivia.length; i < n; i++) {
                result += this.trivia[i].fullText();
            }
            return result;
        };
        NormalSyntaxTriviaList.prototype.hasComment = function () {
            for(var i = 0; i < this.trivia.length; i++) {
                if(isComment(this.trivia[i])) {
                    return true;
                }
            }
            return false;
        };
        NormalSyntaxTriviaList.prototype.hasNewLine = function () {
            for(var i = 0; i < this.trivia.length; i++) {
                if(this.trivia[i].kind() === 5 /* NewLineTrivia */ ) {
                    return true;
                }
            }
            return false;
        };
        NormalSyntaxTriviaList.prototype.hasSkippedText = function () {
            for(var i = 0; i < this.trivia.length; i++) {
                if(this.trivia[i].kind() === 8 /* SkippedTextTrivia */ ) {
                    return true;
                }
            }
            return false;
        };
        NormalSyntaxTriviaList.prototype.toJSON = function (key) {
            return this.trivia;
        };
        NormalSyntaxTriviaList.prototype.collectTextElements = function (elements) {
            for(var i = 0; i < this.trivia.length; i++) {
                (this.trivia[i]).collectTextElements(elements);
            }
        };
        NormalSyntaxTriviaList.prototype.toArray = function () {
            return this.trivia.slice(0);
        };
        NormalSyntaxTriviaList.prototype.concat = function (trivia) {
            return concatTrivia(this, trivia);
        };
        return NormalSyntaxTriviaList;
    })();    
    function triviaList(trivia) {
        if(trivia === undefined || trivia === null || trivia.length === 0) {
            return Syntax.emptyTriviaList;
        }
        if(trivia.length === 1) {
            return new SingletonSyntaxTriviaList(trivia[0]);
        }
        return new NormalSyntaxTriviaList(trivia);
    }
    Syntax.triviaList = triviaList;
    Syntax.spaceTriviaList = triviaList([
        Syntax.spaceTrivia
    ]);
})(Syntax || (Syntax = {}));
var Unicode = (function () {
    function Unicode() { }
    Unicode.unicodeES3IdentifierStart = [
        170, 
        170, 
        181, 
        181, 
        186, 
        186, 
        192, 
        214, 
        216, 
        246, 
        248, 
        543, 
        546, 
        563, 
        592, 
        685, 
        688, 
        696, 
        699, 
        705, 
        720, 
        721, 
        736, 
        740, 
        750, 
        750, 
        890, 
        890, 
        902, 
        902, 
        904, 
        906, 
        908, 
        908, 
        910, 
        929, 
        931, 
        974, 
        976, 
        983, 
        986, 
        1011, 
        1024, 
        1153, 
        1164, 
        1220, 
        1223, 
        1224, 
        1227, 
        1228, 
        1232, 
        1269, 
        1272, 
        1273, 
        1329, 
        1366, 
        1369, 
        1369, 
        1377, 
        1415, 
        1488, 
        1514, 
        1520, 
        1522, 
        1569, 
        1594, 
        1600, 
        1610, 
        1649, 
        1747, 
        1749, 
        1749, 
        1765, 
        1766, 
        1786, 
        1788, 
        1808, 
        1808, 
        1810, 
        1836, 
        1920, 
        1957, 
        2309, 
        2361, 
        2365, 
        2365, 
        2384, 
        2384, 
        2392, 
        2401, 
        2437, 
        2444, 
        2447, 
        2448, 
        2451, 
        2472, 
        2474, 
        2480, 
        2482, 
        2482, 
        2486, 
        2489, 
        2524, 
        2525, 
        2527, 
        2529, 
        2544, 
        2545, 
        2565, 
        2570, 
        2575, 
        2576, 
        2579, 
        2600, 
        2602, 
        2608, 
        2610, 
        2611, 
        2613, 
        2614, 
        2616, 
        2617, 
        2649, 
        2652, 
        2654, 
        2654, 
        2674, 
        2676, 
        2693, 
        2699, 
        2701, 
        2701, 
        2703, 
        2705, 
        2707, 
        2728, 
        2730, 
        2736, 
        2738, 
        2739, 
        2741, 
        2745, 
        2749, 
        2749, 
        2768, 
        2768, 
        2784, 
        2784, 
        2821, 
        2828, 
        2831, 
        2832, 
        2835, 
        2856, 
        2858, 
        2864, 
        2866, 
        2867, 
        2870, 
        2873, 
        2877, 
        2877, 
        2908, 
        2909, 
        2911, 
        2913, 
        2949, 
        2954, 
        2958, 
        2960, 
        2962, 
        2965, 
        2969, 
        2970, 
        2972, 
        2972, 
        2974, 
        2975, 
        2979, 
        2980, 
        2984, 
        2986, 
        2990, 
        2997, 
        2999, 
        3001, 
        3077, 
        3084, 
        3086, 
        3088, 
        3090, 
        3112, 
        3114, 
        3123, 
        3125, 
        3129, 
        3168, 
        3169, 
        3205, 
        3212, 
        3214, 
        3216, 
        3218, 
        3240, 
        3242, 
        3251, 
        3253, 
        3257, 
        3294, 
        3294, 
        3296, 
        3297, 
        3333, 
        3340, 
        3342, 
        3344, 
        3346, 
        3368, 
        3370, 
        3385, 
        3424, 
        3425, 
        3461, 
        3478, 
        3482, 
        3505, 
        3507, 
        3515, 
        3517, 
        3517, 
        3520, 
        3526, 
        3585, 
        3632, 
        3634, 
        3635, 
        3648, 
        3654, 
        3713, 
        3714, 
        3716, 
        3716, 
        3719, 
        3720, 
        3722, 
        3722, 
        3725, 
        3725, 
        3732, 
        3735, 
        3737, 
        3743, 
        3745, 
        3747, 
        3749, 
        3749, 
        3751, 
        3751, 
        3754, 
        3755, 
        3757, 
        3760, 
        3762, 
        3763, 
        3773, 
        3773, 
        3776, 
        3780, 
        3782, 
        3782, 
        3804, 
        3805, 
        3840, 
        3840, 
        3904, 
        3911, 
        3913, 
        3946, 
        3976, 
        3979, 
        4096, 
        4129, 
        4131, 
        4135, 
        4137, 
        4138, 
        4176, 
        4181, 
        4256, 
        4293, 
        4304, 
        4342, 
        4352, 
        4441, 
        4447, 
        4514, 
        4520, 
        4601, 
        4608, 
        4614, 
        4616, 
        4678, 
        4680, 
        4680, 
        4682, 
        4685, 
        4688, 
        4694, 
        4696, 
        4696, 
        4698, 
        4701, 
        4704, 
        4742, 
        4744, 
        4744, 
        4746, 
        4749, 
        4752, 
        4782, 
        4784, 
        4784, 
        4786, 
        4789, 
        4792, 
        4798, 
        4800, 
        4800, 
        4802, 
        4805, 
        4808, 
        4814, 
        4816, 
        4822, 
        4824, 
        4846, 
        4848, 
        4878, 
        4880, 
        4880, 
        4882, 
        4885, 
        4888, 
        4894, 
        4896, 
        4934, 
        4936, 
        4954, 
        5024, 
        5108, 
        5121, 
        5740, 
        5743, 
        5750, 
        5761, 
        5786, 
        5792, 
        5866, 
        6016, 
        6067, 
        6176, 
        6263, 
        6272, 
        6312, 
        7680, 
        7835, 
        7840, 
        7929, 
        7936, 
        7957, 
        7960, 
        7965, 
        7968, 
        8005, 
        8008, 
        8013, 
        8016, 
        8023, 
        8025, 
        8025, 
        8027, 
        8027, 
        8029, 
        8029, 
        8031, 
        8061, 
        8064, 
        8116, 
        8118, 
        8124, 
        8126, 
        8126, 
        8130, 
        8132, 
        8134, 
        8140, 
        8144, 
        8147, 
        8150, 
        8155, 
        8160, 
        8172, 
        8178, 
        8180, 
        8182, 
        8188, 
        8319, 
        8319, 
        8450, 
        8450, 
        8455, 
        8455, 
        8458, 
        8467, 
        8469, 
        8469, 
        8473, 
        8477, 
        8484, 
        8484, 
        8486, 
        8486, 
        8488, 
        8488, 
        8490, 
        8493, 
        8495, 
        8497, 
        8499, 
        8505, 
        8544, 
        8579, 
        12293, 
        12295, 
        12321, 
        12329, 
        12337, 
        12341, 
        12344, 
        12346, 
        12353, 
        12436, 
        12445, 
        12446, 
        12449, 
        12538, 
        12540, 
        12542, 
        12549, 
        12588, 
        12593, 
        12686, 
        12704, 
        12727, 
        13312, 
        13312, 
        19893, 
        19893, 
        19968, 
        19968, 
        40869, 
        40869, 
        40960, 
        42124, 
        44032, 
        44032, 
        55203, 
        55203, 
        63744, 
        64045, 
        64256, 
        64262, 
        64275, 
        64279, 
        64285, 
        64285, 
        64287, 
        64296, 
        64298, 
        64310, 
        64312, 
        64316, 
        64318, 
        64318, 
        64320, 
        64321, 
        64323, 
        64324, 
        64326, 
        64433, 
        64467, 
        64829, 
        64848, 
        64911, 
        64914, 
        64967, 
        65008, 
        65019, 
        65136, 
        65138, 
        65140, 
        65140, 
        65142, 
        65276, 
        65313, 
        65338, 
        65345, 
        65370, 
        65382, 
        65470, 
        65474, 
        65479, 
        65482, 
        65487, 
        65490, 
        65495, 
        65498, 
        65500
    ];
    Unicode.unicodeES3IdentifierPart = [
        768, 
        846, 
        864, 
        866, 
        1155, 
        1158, 
        1425, 
        1441, 
        1443, 
        1465, 
        1467, 
        1469, 
        1471, 
        1471, 
        1473, 
        1474, 
        1476, 
        1476, 
        1611, 
        1621, 
        1632, 
        1641, 
        1648, 
        1648, 
        1750, 
        1756, 
        1759, 
        1764, 
        1767, 
        1768, 
        1770, 
        1773, 
        1776, 
        1785, 
        1809, 
        1809, 
        1840, 
        1866, 
        1958, 
        1968, 
        2305, 
        2307, 
        2364, 
        2364, 
        2366, 
        2381, 
        2385, 
        2388, 
        2402, 
        2403, 
        2406, 
        2415, 
        2433, 
        2435, 
        2492, 
        2492, 
        2494, 
        2500, 
        2503, 
        2504, 
        2507, 
        2509, 
        2519, 
        2519, 
        2530, 
        2531, 
        2534, 
        2543, 
        2562, 
        2562, 
        2620, 
        2620, 
        2622, 
        2626, 
        2631, 
        2632, 
        2635, 
        2637, 
        2662, 
        2673, 
        2689, 
        2691, 
        2748, 
        2748, 
        2750, 
        2757, 
        2759, 
        2761, 
        2763, 
        2765, 
        2790, 
        2799, 
        2817, 
        2819, 
        2876, 
        2876, 
        2878, 
        2883, 
        2887, 
        2888, 
        2891, 
        2893, 
        2902, 
        2903, 
        2918, 
        2927, 
        2946, 
        2947, 
        3006, 
        3010, 
        3014, 
        3016, 
        3018, 
        3021, 
        3031, 
        3031, 
        3047, 
        3055, 
        3073, 
        3075, 
        3134, 
        3140, 
        3142, 
        3144, 
        3146, 
        3149, 
        3157, 
        3158, 
        3174, 
        3183, 
        3202, 
        3203, 
        3262, 
        3268, 
        3270, 
        3272, 
        3274, 
        3277, 
        3285, 
        3286, 
        3302, 
        3311, 
        3330, 
        3331, 
        3390, 
        3395, 
        3398, 
        3400, 
        3402, 
        3405, 
        3415, 
        3415, 
        3430, 
        3439, 
        3458, 
        3459, 
        3530, 
        3530, 
        3535, 
        3540, 
        3542, 
        3542, 
        3544, 
        3551, 
        3570, 
        3571, 
        3633, 
        3633, 
        3636, 
        3642, 
        3655, 
        3662, 
        3664, 
        3673, 
        3761, 
        3761, 
        3764, 
        3769, 
        3771, 
        3772, 
        3784, 
        3789, 
        3792, 
        3801, 
        3864, 
        3865, 
        3872, 
        3881, 
        3893, 
        3893, 
        3895, 
        3895, 
        3897, 
        3897, 
        3902, 
        3903, 
        3953, 
        3972, 
        3974, 
        3975, 
        3984, 
        3991, 
        3993, 
        4028, 
        4038, 
        4038, 
        4140, 
        4146, 
        4150, 
        4153, 
        4160, 
        4169, 
        4182, 
        4185, 
        4969, 
        4977, 
        6068, 
        6099, 
        6112, 
        6121, 
        6160, 
        6169, 
        6313, 
        6313, 
        8255, 
        8256, 
        8400, 
        8412, 
        8417, 
        8417, 
        12330, 
        12335, 
        12441, 
        12442, 
        12539, 
        12539, 
        64286, 
        64286, 
        65056, 
        65059, 
        65075, 
        65076, 
        65101, 
        65103, 
        65296, 
        65305, 
        65343, 
        65343, 
        65381, 
        65381
    ];
    Unicode.unicodeES5IdentifierStart = [
        170, 
        170, 
        181, 
        181, 
        186, 
        186, 
        192, 
        214, 
        216, 
        246, 
        248, 
        705, 
        710, 
        721, 
        736, 
        740, 
        748, 
        748, 
        750, 
        750, 
        880, 
        884, 
        886, 
        887, 
        890, 
        893, 
        902, 
        902, 
        904, 
        906, 
        908, 
        908, 
        910, 
        929, 
        931, 
        1013, 
        1015, 
        1153, 
        1162, 
        1319, 
        1329, 
        1366, 
        1369, 
        1369, 
        1377, 
        1415, 
        1488, 
        1514, 
        1520, 
        1522, 
        1568, 
        1610, 
        1646, 
        1647, 
        1649, 
        1747, 
        1749, 
        1749, 
        1765, 
        1766, 
        1774, 
        1775, 
        1786, 
        1788, 
        1791, 
        1791, 
        1808, 
        1808, 
        1810, 
        1839, 
        1869, 
        1957, 
        1969, 
        1969, 
        1994, 
        2026, 
        2036, 
        2037, 
        2042, 
        2042, 
        2048, 
        2069, 
        2074, 
        2074, 
        2084, 
        2084, 
        2088, 
        2088, 
        2112, 
        2136, 
        2208, 
        2208, 
        2210, 
        2220, 
        2308, 
        2361, 
        2365, 
        2365, 
        2384, 
        2384, 
        2392, 
        2401, 
        2417, 
        2423, 
        2425, 
        2431, 
        2437, 
        2444, 
        2447, 
        2448, 
        2451, 
        2472, 
        2474, 
        2480, 
        2482, 
        2482, 
        2486, 
        2489, 
        2493, 
        2493, 
        2510, 
        2510, 
        2524, 
        2525, 
        2527, 
        2529, 
        2544, 
        2545, 
        2565, 
        2570, 
        2575, 
        2576, 
        2579, 
        2600, 
        2602, 
        2608, 
        2610, 
        2611, 
        2613, 
        2614, 
        2616, 
        2617, 
        2649, 
        2652, 
        2654, 
        2654, 
        2674, 
        2676, 
        2693, 
        2701, 
        2703, 
        2705, 
        2707, 
        2728, 
        2730, 
        2736, 
        2738, 
        2739, 
        2741, 
        2745, 
        2749, 
        2749, 
        2768, 
        2768, 
        2784, 
        2785, 
        2821, 
        2828, 
        2831, 
        2832, 
        2835, 
        2856, 
        2858, 
        2864, 
        2866, 
        2867, 
        2869, 
        2873, 
        2877, 
        2877, 
        2908, 
        2909, 
        2911, 
        2913, 
        2929, 
        2929, 
        2947, 
        2947, 
        2949, 
        2954, 
        2958, 
        2960, 
        2962, 
        2965, 
        2969, 
        2970, 
        2972, 
        2972, 
        2974, 
        2975, 
        2979, 
        2980, 
        2984, 
        2986, 
        2990, 
        3001, 
        3024, 
        3024, 
        3077, 
        3084, 
        3086, 
        3088, 
        3090, 
        3112, 
        3114, 
        3123, 
        3125, 
        3129, 
        3133, 
        3133, 
        3160, 
        3161, 
        3168, 
        3169, 
        3205, 
        3212, 
        3214, 
        3216, 
        3218, 
        3240, 
        3242, 
        3251, 
        3253, 
        3257, 
        3261, 
        3261, 
        3294, 
        3294, 
        3296, 
        3297, 
        3313, 
        3314, 
        3333, 
        3340, 
        3342, 
        3344, 
        3346, 
        3386, 
        3389, 
        3389, 
        3406, 
        3406, 
        3424, 
        3425, 
        3450, 
        3455, 
        3461, 
        3478, 
        3482, 
        3505, 
        3507, 
        3515, 
        3517, 
        3517, 
        3520, 
        3526, 
        3585, 
        3632, 
        3634, 
        3635, 
        3648, 
        3654, 
        3713, 
        3714, 
        3716, 
        3716, 
        3719, 
        3720, 
        3722, 
        3722, 
        3725, 
        3725, 
        3732, 
        3735, 
        3737, 
        3743, 
        3745, 
        3747, 
        3749, 
        3749, 
        3751, 
        3751, 
        3754, 
        3755, 
        3757, 
        3760, 
        3762, 
        3763, 
        3773, 
        3773, 
        3776, 
        3780, 
        3782, 
        3782, 
        3804, 
        3807, 
        3840, 
        3840, 
        3904, 
        3911, 
        3913, 
        3948, 
        3976, 
        3980, 
        4096, 
        4138, 
        4159, 
        4159, 
        4176, 
        4181, 
        4186, 
        4189, 
        4193, 
        4193, 
        4197, 
        4198, 
        4206, 
        4208, 
        4213, 
        4225, 
        4238, 
        4238, 
        4256, 
        4293, 
        4295, 
        4295, 
        4301, 
        4301, 
        4304, 
        4346, 
        4348, 
        4680, 
        4682, 
        4685, 
        4688, 
        4694, 
        4696, 
        4696, 
        4698, 
        4701, 
        4704, 
        4744, 
        4746, 
        4749, 
        4752, 
        4784, 
        4786, 
        4789, 
        4792, 
        4798, 
        4800, 
        4800, 
        4802, 
        4805, 
        4808, 
        4822, 
        4824, 
        4880, 
        4882, 
        4885, 
        4888, 
        4954, 
        4992, 
        5007, 
        5024, 
        5108, 
        5121, 
        5740, 
        5743, 
        5759, 
        5761, 
        5786, 
        5792, 
        5866, 
        5870, 
        5872, 
        5888, 
        5900, 
        5902, 
        5905, 
        5920, 
        5937, 
        5952, 
        5969, 
        5984, 
        5996, 
        5998, 
        6000, 
        6016, 
        6067, 
        6103, 
        6103, 
        6108, 
        6108, 
        6176, 
        6263, 
        6272, 
        6312, 
        6314, 
        6314, 
        6320, 
        6389, 
        6400, 
        6428, 
        6480, 
        6509, 
        6512, 
        6516, 
        6528, 
        6571, 
        6593, 
        6599, 
        6656, 
        6678, 
        6688, 
        6740, 
        6823, 
        6823, 
        6917, 
        6963, 
        6981, 
        6987, 
        7043, 
        7072, 
        7086, 
        7087, 
        7098, 
        7141, 
        7168, 
        7203, 
        7245, 
        7247, 
        7258, 
        7293, 
        7401, 
        7404, 
        7406, 
        7409, 
        7413, 
        7414, 
        7424, 
        7615, 
        7680, 
        7957, 
        7960, 
        7965, 
        7968, 
        8005, 
        8008, 
        8013, 
        8016, 
        8023, 
        8025, 
        8025, 
        8027, 
        8027, 
        8029, 
        8029, 
        8031, 
        8061, 
        8064, 
        8116, 
        8118, 
        8124, 
        8126, 
        8126, 
        8130, 
        8132, 
        8134, 
        8140, 
        8144, 
        8147, 
        8150, 
        8155, 
        8160, 
        8172, 
        8178, 
        8180, 
        8182, 
        8188, 
        8305, 
        8305, 
        8319, 
        8319, 
        8336, 
        8348, 
        8450, 
        8450, 
        8455, 
        8455, 
        8458, 
        8467, 
        8469, 
        8469, 
        8473, 
        8477, 
        8484, 
        8484, 
        8486, 
        8486, 
        8488, 
        8488, 
        8490, 
        8493, 
        8495, 
        8505, 
        8508, 
        8511, 
        8517, 
        8521, 
        8526, 
        8526, 
        8544, 
        8584, 
        11264, 
        11310, 
        11312, 
        11358, 
        11360, 
        11492, 
        11499, 
        11502, 
        11506, 
        11507, 
        11520, 
        11557, 
        11559, 
        11559, 
        11565, 
        11565, 
        11568, 
        11623, 
        11631, 
        11631, 
        11648, 
        11670, 
        11680, 
        11686, 
        11688, 
        11694, 
        11696, 
        11702, 
        11704, 
        11710, 
        11712, 
        11718, 
        11720, 
        11726, 
        11728, 
        11734, 
        11736, 
        11742, 
        11823, 
        11823, 
        12293, 
        12295, 
        12321, 
        12329, 
        12337, 
        12341, 
        12344, 
        12348, 
        12353, 
        12438, 
        12445, 
        12447, 
        12449, 
        12538, 
        12540, 
        12543, 
        12549, 
        12589, 
        12593, 
        12686, 
        12704, 
        12730, 
        12784, 
        12799, 
        13312, 
        13312, 
        19893, 
        19893, 
        19968, 
        19968, 
        40908, 
        40908, 
        40960, 
        42124, 
        42192, 
        42237, 
        42240, 
        42508, 
        42512, 
        42527, 
        42538, 
        42539, 
        42560, 
        42606, 
        42623, 
        42647, 
        42656, 
        42735, 
        42775, 
        42783, 
        42786, 
        42888, 
        42891, 
        42894, 
        42896, 
        42899, 
        42912, 
        42922, 
        43000, 
        43009, 
        43011, 
        43013, 
        43015, 
        43018, 
        43020, 
        43042, 
        43072, 
        43123, 
        43138, 
        43187, 
        43250, 
        43255, 
        43259, 
        43259, 
        43274, 
        43301, 
        43312, 
        43334, 
        43360, 
        43388, 
        43396, 
        43442, 
        43471, 
        43471, 
        43520, 
        43560, 
        43584, 
        43586, 
        43588, 
        43595, 
        43616, 
        43638, 
        43642, 
        43642, 
        43648, 
        43695, 
        43697, 
        43697, 
        43701, 
        43702, 
        43705, 
        43709, 
        43712, 
        43712, 
        43714, 
        43714, 
        43739, 
        43741, 
        43744, 
        43754, 
        43762, 
        43764, 
        43777, 
        43782, 
        43785, 
        43790, 
        43793, 
        43798, 
        43808, 
        43814, 
        43816, 
        43822, 
        43968, 
        44002, 
        44032, 
        44032, 
        55203, 
        55203, 
        55216, 
        55238, 
        55243, 
        55291, 
        63744, 
        64109, 
        64112, 
        64217, 
        64256, 
        64262, 
        64275, 
        64279, 
        64285, 
        64285, 
        64287, 
        64296, 
        64298, 
        64310, 
        64312, 
        64316, 
        64318, 
        64318, 
        64320, 
        64321, 
        64323, 
        64324, 
        64326, 
        64433, 
        64467, 
        64829, 
        64848, 
        64911, 
        64914, 
        64967, 
        65008, 
        65019, 
        65136, 
        65140, 
        65142, 
        65276, 
        65313, 
        65338, 
        65345, 
        65370, 
        65382, 
        65470, 
        65474, 
        65479, 
        65482, 
        65487, 
        65490, 
        65495, 
        65498, 
        65500
    ];
    Unicode.unicodeES5IdentifierPart = [
        768, 
        879, 
        1155, 
        1159, 
        1425, 
        1469, 
        1471, 
        1471, 
        1473, 
        1474, 
        1476, 
        1477, 
        1479, 
        1479, 
        1552, 
        1562, 
        1611, 
        1641, 
        1648, 
        1648, 
        1750, 
        1756, 
        1759, 
        1764, 
        1767, 
        1768, 
        1770, 
        1773, 
        1776, 
        1785, 
        1809, 
        1809, 
        1840, 
        1866, 
        1958, 
        1968, 
        1984, 
        1993, 
        2027, 
        2035, 
        2070, 
        2073, 
        2075, 
        2083, 
        2085, 
        2087, 
        2089, 
        2093, 
        2137, 
        2139, 
        2276, 
        2302, 
        2304, 
        2307, 
        2362, 
        2364, 
        2366, 
        2383, 
        2385, 
        2391, 
        2402, 
        2403, 
        2406, 
        2415, 
        2433, 
        2435, 
        2492, 
        2492, 
        2494, 
        2500, 
        2503, 
        2504, 
        2507, 
        2509, 
        2519, 
        2519, 
        2530, 
        2531, 
        2534, 
        2543, 
        2561, 
        2563, 
        2620, 
        2620, 
        2622, 
        2626, 
        2631, 
        2632, 
        2635, 
        2637, 
        2641, 
        2641, 
        2662, 
        2673, 
        2677, 
        2677, 
        2689, 
        2691, 
        2748, 
        2748, 
        2750, 
        2757, 
        2759, 
        2761, 
        2763, 
        2765, 
        2786, 
        2787, 
        2790, 
        2799, 
        2817, 
        2819, 
        2876, 
        2876, 
        2878, 
        2884, 
        2887, 
        2888, 
        2891, 
        2893, 
        2902, 
        2903, 
        2914, 
        2915, 
        2918, 
        2927, 
        2946, 
        2946, 
        3006, 
        3010, 
        3014, 
        3016, 
        3018, 
        3021, 
        3031, 
        3031, 
        3046, 
        3055, 
        3073, 
        3075, 
        3134, 
        3140, 
        3142, 
        3144, 
        3146, 
        3149, 
        3157, 
        3158, 
        3170, 
        3171, 
        3174, 
        3183, 
        3202, 
        3203, 
        3260, 
        3260, 
        3262, 
        3268, 
        3270, 
        3272, 
        3274, 
        3277, 
        3285, 
        3286, 
        3298, 
        3299, 
        3302, 
        3311, 
        3330, 
        3331, 
        3390, 
        3396, 
        3398, 
        3400, 
        3402, 
        3405, 
        3415, 
        3415, 
        3426, 
        3427, 
        3430, 
        3439, 
        3458, 
        3459, 
        3530, 
        3530, 
        3535, 
        3540, 
        3542, 
        3542, 
        3544, 
        3551, 
        3570, 
        3571, 
        3633, 
        3633, 
        3636, 
        3642, 
        3655, 
        3662, 
        3664, 
        3673, 
        3761, 
        3761, 
        3764, 
        3769, 
        3771, 
        3772, 
        3784, 
        3789, 
        3792, 
        3801, 
        3864, 
        3865, 
        3872, 
        3881, 
        3893, 
        3893, 
        3895, 
        3895, 
        3897, 
        3897, 
        3902, 
        3903, 
        3953, 
        3972, 
        3974, 
        3975, 
        3981, 
        3991, 
        3993, 
        4028, 
        4038, 
        4038, 
        4139, 
        4158, 
        4160, 
        4169, 
        4182, 
        4185, 
        4190, 
        4192, 
        4194, 
        4196, 
        4199, 
        4205, 
        4209, 
        4212, 
        4226, 
        4237, 
        4239, 
        4253, 
        4957, 
        4959, 
        5906, 
        5908, 
        5938, 
        5940, 
        5970, 
        5971, 
        6002, 
        6003, 
        6068, 
        6099, 
        6109, 
        6109, 
        6112, 
        6121, 
        6155, 
        6157, 
        6160, 
        6169, 
        6313, 
        6313, 
        6432, 
        6443, 
        6448, 
        6459, 
        6470, 
        6479, 
        6576, 
        6592, 
        6600, 
        6601, 
        6608, 
        6617, 
        6679, 
        6683, 
        6741, 
        6750, 
        6752, 
        6780, 
        6783, 
        6793, 
        6800, 
        6809, 
        6912, 
        6916, 
        6964, 
        6980, 
        6992, 
        7001, 
        7019, 
        7027, 
        7040, 
        7042, 
        7073, 
        7085, 
        7088, 
        7097, 
        7142, 
        7155, 
        7204, 
        7223, 
        7232, 
        7241, 
        7248, 
        7257, 
        7376, 
        7378, 
        7380, 
        7400, 
        7405, 
        7405, 
        7410, 
        7412, 
        7616, 
        7654, 
        7676, 
        7679, 
        8204, 
        8205, 
        8255, 
        8256, 
        8276, 
        8276, 
        8400, 
        8412, 
        8417, 
        8417, 
        8421, 
        8432, 
        11503, 
        11505, 
        11647, 
        11647, 
        11744, 
        11775, 
        12330, 
        12335, 
        12441, 
        12442, 
        42528, 
        42537, 
        42607, 
        42607, 
        42612, 
        42621, 
        42655, 
        42655, 
        42736, 
        42737, 
        43010, 
        43010, 
        43014, 
        43014, 
        43019, 
        43019, 
        43043, 
        43047, 
        43136, 
        43137, 
        43188, 
        43204, 
        43216, 
        43225, 
        43232, 
        43249, 
        43264, 
        43273, 
        43302, 
        43309, 
        43335, 
        43347, 
        43392, 
        43395, 
        43443, 
        43456, 
        43472, 
        43481, 
        43561, 
        43574, 
        43587, 
        43587, 
        43596, 
        43597, 
        43600, 
        43609, 
        43643, 
        43643, 
        43696, 
        43696, 
        43698, 
        43700, 
        43703, 
        43704, 
        43710, 
        43711, 
        43713, 
        43713, 
        43755, 
        43759, 
        43765, 
        43766, 
        44003, 
        44010, 
        44012, 
        44013, 
        44016, 
        44025, 
        64286, 
        64286, 
        65024, 
        65039, 
        65056, 
        65062, 
        65075, 
        65076, 
        65101, 
        65103, 
        65296, 
        65305, 
        65343, 
        65343
    ];
    Unicode.lookupInUnicodeMap = function lookupInUnicodeMap(code, map) {
        if(code < map[0]) {
            return false;
        }
        var lo = 0;
        var hi = map.length;
        var mid;
        while(lo + 1 < hi) {
            mid = lo + (hi - lo) / 2;
            mid -= mid % 2;
            if(map[mid] <= code && code <= map[mid + 1]) {
                return true;
            }
            if(code < map[mid]) {
                hi = mid;
            } else {
                lo = mid + 2;
            }
        }
        return false;
    };
    Unicode.isIdentifierStart = function isIdentifierStart(code, languageVersion) {
        if(languageVersion === 0 /* EcmaScript3 */ ) {
            return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES3IdentifierStart);
        } else if(languageVersion === 1 /* EcmaScript5 */ ) {
            return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES5IdentifierStart);
        } else {
            throw Errors.argumentOutOfRange("languageVersion");
        }
    };
    Unicode.isIdentifierPart = function isIdentifierPart(code, languageVersion) {
        if(languageVersion === 0 /* EcmaScript3 */ ) {
            return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES3IdentifierPart);
        } else if(languageVersion === 1 /* EcmaScript5 */ ) {
            return Unicode.lookupInUnicodeMap(code, Unicode.unicodeES5IdentifierPart);
        } else {
            throw Errors.argumentOutOfRange("languageVersion");
        }
    };
    return Unicode;
})();
var Scanner = (function () {
    function Scanner(text, languageVersion, stringTable, window) {
        if (typeof window === "undefined") { window = ArrayUtilities.createArray(2048, 0); }
        Scanner.initializeStaticData();
        this.slidingWindow = new SlidingWindow(this, window, 0, text.length());
        this.text = text;
        this.stringTable = stringTable;
        this.languageVersion = languageVersion;
    }
    Scanner.isKeywordStartCharacter = [];
    Scanner.isIdentifierStartCharacter = [];
    Scanner.isIdentifierPartCharacter = [];
    Scanner.isNumericLiteralStart = [];
    Scanner.initializeStaticData = function initializeStaticData() {
        if(Scanner.isKeywordStartCharacter.length === 0) {
            Scanner.isKeywordStartCharacter = ArrayUtilities.createArray(127 /* maxAsciiCharacter */ , false);
            Scanner.isIdentifierStartCharacter = ArrayUtilities.createArray(127 /* maxAsciiCharacter */ , false);
            Scanner.isIdentifierPartCharacter = ArrayUtilities.createArray(127 /* maxAsciiCharacter */ , false);
            Scanner.isNumericLiteralStart = ArrayUtilities.createArray(127 /* maxAsciiCharacter */ , false);
            for(var character = 0; character < 127 /* maxAsciiCharacter */ ; character++) {
                if(character >= 97 /* a */  && character <= 122 /* z */ ) {
                    Scanner.isIdentifierStartCharacter[character] = true;
                    Scanner.isIdentifierPartCharacter[character] = true;
                } else if((character >= 65 /* A */  && character <= 90 /* Z */ ) || character === 95 /* _ */  || character === 36 /* $ */ ) {
                    Scanner.isIdentifierStartCharacter[character] = true;
                    Scanner.isIdentifierPartCharacter[character] = true;
                } else if(character >= 48 /* _0 */  && character <= 57 /* _9 */ ) {
                    Scanner.isIdentifierPartCharacter[character] = true;
                    Scanner.isNumericLiteralStart[character] = true;
                }
            }
            Scanner.isNumericLiteralStart[46 /* dot */ ] = true;
            for(var keywordKind = 15 /* FirstKeyword */ ; keywordKind <= 69 /* LastKeyword */ ; keywordKind++) {
                var keyword = SyntaxFacts.getText(keywordKind);
                Scanner.isKeywordStartCharacter[keyword.charCodeAt(0)] = true;
            }
        }
    };
    Scanner.prototype.fetchMoreItems = function (argument, sourceIndex, window, destinationIndex, spaceAvailable) {
        var charactersRemaining = this.text.length() - sourceIndex;
        var amountToRead = MathPrototype.min(charactersRemaining, spaceAvailable);
        this.text.copyTo(sourceIndex, window, destinationIndex, amountToRead);
        return amountToRead;
    };
    Scanner.prototype.currentCharCode = function () {
        return this.slidingWindow.currentItem(null);
    };
    Scanner.prototype.setAbsoluteIndex = function (index) {
        this.slidingWindow.setAbsoluteIndex(index);
    };
    Scanner.prototype.scan = function (diagnostics, allowRegularExpression) {
        var fullStart = this.slidingWindow.absoluteIndex();
        var leadingTriviaInfo = this.scanTriviaInfo(diagnostics, false);
        var start = this.slidingWindow.absoluteIndex();
        var kind = this.scanSyntaxToken(diagnostics, allowRegularExpression);
        var end = this.slidingWindow.absoluteIndex();
        var trailingTriviaInfo = this.scanTriviaInfo(diagnostics, true);
        if(kind >= 15 /* FirstFixedWidth */ ) {
            if(leadingTriviaInfo === 0) {
                if(trailingTriviaInfo === 0) {
                    return new Syntax.FixedWidthTokenWithNoTrivia(kind);
                } else {
                    return new Syntax.FixedWidthTokenWithTrailingTrivia(this.text, fullStart, kind, trailingTriviaInfo);
                }
            } else if(trailingTriviaInfo === 0) {
                return new Syntax.FixedWidthTokenWithLeadingTrivia(this.text, fullStart, kind, leadingTriviaInfo);
            } else {
                return new Syntax.FixedWidthTokenWithLeadingAndTrailingTrivia(this.text, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);
            }
        } else {
            var width = end - start;
            if(leadingTriviaInfo === 0) {
                if(trailingTriviaInfo === 0) {
                    return new Syntax.VariableWidthTokenWithNoTrivia(this.text, fullStart, kind, width);
                } else {
                    return new Syntax.VariableWidthTokenWithTrailingTrivia(this.text, fullStart, kind, width, trailingTriviaInfo);
                }
            } else if(trailingTriviaInfo === 0) {
                return new Syntax.VariableWidthTokenWithLeadingTrivia(this.text, fullStart, kind, leadingTriviaInfo, width);
            } else {
                return new Syntax.VariableWidthTokenWithLeadingAndTrailingTrivia(this.text, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);
            }
        }
    };
    Scanner.triviaWindow = ArrayUtilities.createArray(2048, 0);
    Scanner.scanTrivia = function scanTrivia(text, start, length, isTrailing) {
        Debug.assert(length > 0);
        var scanner = new Scanner(text.subText(new TextSpan(start, length)), 1 /* EcmaScript5 */ , null, Scanner.triviaWindow);
        return scanner.scanTrivia(isTrailing);
    };
    Scanner.prototype.scanTrivia = function (isTrailing) {
        var trivia = [];
        while(true) {
            if(!this.slidingWindow.isAtEndOfSource()) {
                var ch = this.currentCharCode();
                switch(ch) {
                    case 32 /* space */ :
                    case 9 /* tab */ :
                    case 11 /* verticalTab */ :
                    case 12 /* formFeed */ :
                    case 160 /* nonBreakingSpace */ :
                    case 65279 /* byteOrderMark */ :
                        trivia.push(this.scanWhitespaceTrivia());
                        continue;
                    case 47 /* slash */ :
                        var ch2 = this.slidingWindow.peekItemN(1);
                        if(ch2 === 47 /* slash */ ) {
                            trivia.push(this.scanSingleLineCommentTrivia());
                            continue;
                        }
                        if(ch2 === 42 /* asterisk */ ) {
                            trivia.push(this.scanMultiLineCommentTrivia());
                            continue;
                        }
                        throw Errors.invalidOperation();
                    case 13 /* carriageReturn */ :
                    case 10 /* lineFeed */ :
                    case 8233 /* paragraphSeparator */ :
                    case 8232 /* lineSeparator */ :
                        trivia.push(this.scanLineTerminatorSequenceTrivia(ch));
                        if(!isTrailing) {
                            continue;
                        }
                        break;
                    default:
                        throw Errors.invalidOperation();
                }
            }
            Debug.assert(trivia.length > 0);
            return Syntax.triviaList(trivia);
        }
    };
    Scanner.prototype.scanTriviaInfo = function (diagnostics, isTrailing) {
        var width = 0;
        var hasCommentOrNewLine = 0;
        while(true) {
            var ch = this.currentCharCode();
            switch(ch) {
                case 32 /* space */ :
                case 9 /* tab */ :
                case 11 /* verticalTab */ :
                case 12 /* formFeed */ :
                case 160 /* nonBreakingSpace */ :
                case 65279 /* byteOrderMark */ :
                    this.slidingWindow.moveToNextItem();
                    width++;
                    continue;
                case 47 /* slash */ :
                    var ch2 = this.slidingWindow.peekItemN(1);
                    if(ch2 === 47 /* slash */ ) {
                        hasCommentOrNewLine |= 2 /* TriviaCommentMask */ ;
                        width += this.scanSingleLineCommentTriviaLength();
                        continue;
                    }
                    if(ch2 === 42 /* asterisk */ ) {
                        hasCommentOrNewLine |= 2 /* TriviaCommentMask */ ;
                        width += this.scanMultiLineCommentTriviaLength(diagnostics);
                        continue;
                    }
                    break;
                case 13 /* carriageReturn */ :
                case 10 /* lineFeed */ :
                case 8233 /* paragraphSeparator */ :
                case 8232 /* lineSeparator */ :
                    hasCommentOrNewLine |= 1 /* TriviaNewLineMask */ ;
                    width += this.scanLineTerminatorSequenceLength(ch);
                    if(!isTrailing) {
                        continue;
                    }
                    break;
            }
            return (width << 2 /* TriviaFullWidthShift */ ) | hasCommentOrNewLine;
        }
    };
    Scanner.prototype.isNewLineCharacter = function (ch) {
        switch(ch) {
            case 13 /* carriageReturn */ :
            case 10 /* lineFeed */ :
            case 8233 /* paragraphSeparator */ :
            case 8232 /* lineSeparator */ :
                return true;
            default:
                return false;
        }
    };
    Scanner.prototype.scanWhitespaceTrivia = function () {
        var absoluteStartIndex = this.slidingWindow.getAndPinAbsoluteIndex();
        var width = 0;
        while(true) {
            var ch = this.currentCharCode();
            switch(ch) {
                case 32 /* space */ :
                case 9 /* tab */ :
                case 11 /* verticalTab */ :
                case 12 /* formFeed */ :
                case 160 /* nonBreakingSpace */ :
                case 65279 /* byteOrderMark */ :
                    this.slidingWindow.moveToNextItem();
                    width++;
                    continue;
            }
            break;
        }
        var text = this.substring(absoluteStartIndex, absoluteStartIndex + width, false);
        this.slidingWindow.releaseAndUnpinAbsoluteIndex(absoluteStartIndex);
        return Syntax.whitespace(text);
    };
    Scanner.prototype.scanSingleLineCommentTrivia = function () {
        var absoluteStartIndex = this.slidingWindow.getAndPinAbsoluteIndex();
        var width = this.scanSingleLineCommentTriviaLength();
        var text = this.substring(absoluteStartIndex, absoluteStartIndex + width, false);
        this.slidingWindow.releaseAndUnpinAbsoluteIndex(absoluteStartIndex);
        return Syntax.singleLineComment(text);
    };
    Scanner.prototype.scanSingleLineCommentTriviaLength = function () {
        this.slidingWindow.moveToNextItem();
        this.slidingWindow.moveToNextItem();
        var width = 2;
        while(true) {
            if(this.slidingWindow.isAtEndOfSource() || this.isNewLineCharacter(this.currentCharCode())) {
                return width;
            }
            this.slidingWindow.moveToNextItem();
            width++;
        }
    };
    Scanner.prototype.scanMultiLineCommentTrivia = function () {
        var absoluteStartIndex = this.slidingWindow.getAndPinAbsoluteIndex();
        var width = this.scanMultiLineCommentTriviaLength(null);
        var text = this.substring(absoluteStartIndex, absoluteStartIndex + width, false);
        this.slidingWindow.releaseAndUnpinAbsoluteIndex(absoluteStartIndex);
        return Syntax.multiLineComment(text);
    };
    Scanner.prototype.scanMultiLineCommentTriviaLength = function (diagnostics) {
        this.slidingWindow.moveToNextItem();
        this.slidingWindow.moveToNextItem();
        var width = 2;
        while(true) {
            if(this.slidingWindow.isAtEndOfSource()) {
                if(diagnostics !== null) {
                    diagnostics.push(new SyntaxDiagnostic(this.slidingWindow.absoluteIndex(), 0, 10 /* _StarSlash__expected */ , null));
                }
                return width;
            }
            var ch = this.currentCharCode();
            if(ch === 42 /* asterisk */  && this.slidingWindow.peekItemN(1) === 47 /* slash */ ) {
                this.slidingWindow.moveToNextItem();
                this.slidingWindow.moveToNextItem();
                width += 2;
                return width;
            }
            this.slidingWindow.moveToNextItem();
            width++;
        }
    };
    Scanner.prototype.scanLineTerminatorSequenceTrivia = function (ch) {
        var absoluteStartIndex = this.slidingWindow.getAndPinAbsoluteIndex();
        var width = this.scanLineTerminatorSequenceLength(ch);
        var text = this.substring(absoluteStartIndex, absoluteStartIndex + width, false);
        this.slidingWindow.releaseAndUnpinAbsoluteIndex(absoluteStartIndex);
        return Syntax.trivia(5 /* NewLineTrivia */ , text);
    };
    Scanner.prototype.scanLineTerminatorSequenceLength = function (ch) {
        this.slidingWindow.moveToNextItem();
        if(ch === 13 /* carriageReturn */  && this.currentCharCode() === 10 /* lineFeed */ ) {
            this.slidingWindow.moveToNextItem();
            return 2;
        } else {
            return 1;
        }
    };
    Scanner.prototype.scanSyntaxToken = function (diagnostics, allowRegularExpression) {
        if(this.slidingWindow.isAtEndOfSource()) {
            return 10 /* EndOfFileToken */ ;
        }
        var character = this.currentCharCode();
        switch(character) {
            case 34 /* doubleQuote */ :
            case 39 /* singleQuote */ :
                return this.scanStringLiteral(diagnostics);
            case 47 /* slash */ :
                return this.scanSlashToken(allowRegularExpression);
            case 46 /* dot */ :
                return this.scanDotToken();
            case 45 /* minus */ :
                return this.scanMinusToken();
            case 33 /* exclamation */ :
                return this.scanExclamationToken();
            case 61 /* equals */ :
                return this.scanEqualsToken();
            case 124 /* bar */ :
                return this.scanBarToken();
            case 42 /* asterisk */ :
                return this.scanAsteriskToken();
            case 43 /* plus */ :
                return this.scanPlusToken();
            case 37 /* percent */ :
                return this.scanPercentToken();
            case 38 /* ampersand */ :
                return this.scanAmpersandToken();
            case 94 /* caret */ :
                return this.scanCaretToken();
            case 60 /* lessThan */ :
                return this.scanLessThanToken();
            case 62 /* greaterThan */ :
                return this.advanceAndSetTokenKind(81 /* GreaterThanToken */ );
            case 44 /* comma */ :
                return this.advanceAndSetTokenKind(79 /* CommaToken */ );
            case 58 /* colon */ :
                return this.advanceAndSetTokenKind(106 /* ColonToken */ );
            case 59 /* semicolon */ :
                return this.advanceAndSetTokenKind(78 /* SemicolonToken */ );
            case 126 /* tilde */ :
                return this.advanceAndSetTokenKind(102 /* TildeToken */ );
            case 40 /* openParen */ :
                return this.advanceAndSetTokenKind(72 /* OpenParenToken */ );
            case 41 /* closeParen */ :
                return this.advanceAndSetTokenKind(73 /* CloseParenToken */ );
            case 123 /* openBrace */ :
                return this.advanceAndSetTokenKind(70 /* OpenBraceToken */ );
            case 125 /* closeBrace */ :
                return this.advanceAndSetTokenKind(71 /* CloseBraceToken */ );
            case 91 /* openBracket */ :
                return this.advanceAndSetTokenKind(74 /* OpenBracketToken */ );
            case 93 /* closeBracket */ :
                return this.advanceAndSetTokenKind(75 /* CloseBracketToken */ );
            case 63 /* question */ :
                return this.advanceAndSetTokenKind(105 /* QuestionToken */ );
        }
        if(Scanner.isNumericLiteralStart[character]) {
            return this.scanNumericLiteral();
        }
        if(Scanner.isIdentifierStartCharacter[character]) {
            var result = this.tryFastScanIdentifierOrKeyword(character);
            if(result !== 0 /* None */ ) {
                return result;
            }
        }
        if(this.isIdentifierStart(this.peekCharOrUnicodeEscape())) {
            return this.slowScanIdentifier(diagnostics);
        }
        return this.scanDefaultCharacter(character, diagnostics);
    };
    Scanner.prototype.isIdentifierStart = function (interpretedChar) {
        if(Scanner.isIdentifierStartCharacter[interpretedChar]) {
            return true;
        }
        return interpretedChar > 127 /* maxAsciiCharacter */  && Unicode.isIdentifierStart(interpretedChar, this.languageVersion);
    };
    Scanner.prototype.isIdentifierPart = function (interpretedChar) {
        if(Scanner.isIdentifierPartCharacter[interpretedChar]) {
            return true;
        }
        return interpretedChar > 127 /* maxAsciiCharacter */  && Unicode.isIdentifierPart(interpretedChar, this.languageVersion);
    };
    Scanner.prototype.tryFastScanIdentifierOrKeyword = function (firstCharacter) {
        var startIndex = this.slidingWindow.getAndPinAbsoluteIndex();
        while(true) {
            var character = this.currentCharCode();
            if(Scanner.isIdentifierPartCharacter[character]) {
                this.slidingWindow.moveToNextItem();
            } else if(character === 92 /* backslash */  || character > 127 /* maxAsciiCharacter */ ) {
                this.slidingWindow.rewindToPinnedIndex(startIndex);
                this.slidingWindow.releaseAndUnpinAbsoluteIndex(startIndex);
                return 0 /* None */ ;
            } else {
                var endIndex = this.slidingWindow.absoluteIndex();
                var kind;
                if(Scanner.isKeywordStartCharacter[firstCharacter]) {
                    var offset = startIndex - this.slidingWindow.windowAbsoluteStartIndex;
                    kind = ScannerUtilities.identifierKind(this.slidingWindow.window, offset, endIndex - startIndex);
                } else {
                    kind = 11 /* IdentifierName */ ;
                }
                this.slidingWindow.releaseAndUnpinAbsoluteIndex(startIndex);
                return kind;
            }
        }
    };
    Scanner.prototype.slowScanIdentifier = function (diagnostics) {
        var startIndex = this.slidingWindow.absoluteIndex();
        do {
            this.scanCharOrUnicodeEscape(diagnostics);
        }while(this.isIdentifierPart(this.peekCharOrUnicodeEscape()));
        return 11 /* IdentifierName */ ;
    };
    Scanner.prototype.scanNumericLiteral = function () {
        if(this.isHexNumericLiteral()) {
            return this.scanHexNumericLiteral();
        } else {
            return this.scanDecimalNumericLiteral();
        }
    };
    Scanner.prototype.scanDecimalNumericLiteral = function () {
        while(CharacterInfo.isDecimalDigit(this.currentCharCode())) {
            this.slidingWindow.moveToNextItem();
        }
        if(this.currentCharCode() === 46 /* dot */ ) {
            this.slidingWindow.moveToNextItem();
        }
        while(CharacterInfo.isDecimalDigit(this.currentCharCode())) {
            this.slidingWindow.moveToNextItem();
        }
        var ch = this.currentCharCode();
        if(ch === 101 /* e */  || ch === 69 /* E */ ) {
            this.slidingWindow.moveToNextItem();
            ch = this.currentCharCode();
            if(ch === 45 /* minus */  || ch === 43 /* plus */ ) {
                if(CharacterInfo.isDecimalDigit(this.slidingWindow.peekItemN(1))) {
                    this.slidingWindow.moveToNextItem();
                }
            }
        }
        while(CharacterInfo.isDecimalDigit(this.currentCharCode())) {
            this.slidingWindow.moveToNextItem();
        }
        return 13 /* NumericLiteral */ ;
    };
    Scanner.prototype.scanHexNumericLiteral = function () {
        Debug.assert(this.isHexNumericLiteral());
        this.slidingWindow.moveToNextItem();
        this.slidingWindow.moveToNextItem();
        while(CharacterInfo.isHexDigit(this.currentCharCode())) {
            this.slidingWindow.moveToNextItem();
        }
        return 13 /* NumericLiteral */ ;
    };
    Scanner.prototype.isHexNumericLiteral = function () {
        if(this.currentCharCode() === 48 /* _0 */ ) {
            var ch = this.slidingWindow.peekItemN(1);
            if(ch === 120 /* x */  || ch === 88 /* X */ ) {
                ch = this.slidingWindow.peekItemN(2);
                return CharacterInfo.isHexDigit(ch);
            }
        }
        return false;
    };
    Scanner.prototype.advanceAndSetTokenKind = function (kind) {
        this.slidingWindow.moveToNextItem();
        return kind;
    };
    Scanner.prototype.scanLessThanToken = function () {
        this.slidingWindow.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 82 /* LessThanEqualsToken */ ;
        } else if(this.currentCharCode() === 60 /* lessThan */ ) {
            this.slidingWindow.moveToNextItem();
            if(this.currentCharCode() === 61 /* equals */ ) {
                this.slidingWindow.moveToNextItem();
                return 112 /* LessThanLessThanEqualsToken */ ;
            } else {
                return 95 /* LessThanLessThanToken */ ;
            }
        } else {
            return 80 /* LessThanToken */ ;
        }
    };
    Scanner.prototype.scanBarToken = function () {
        this.slidingWindow.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 116 /* BarEqualsToken */ ;
        } else if(this.currentCharCode() === 124 /* bar */ ) {
            this.slidingWindow.moveToNextItem();
            return 104 /* BarBarToken */ ;
        } else {
            return 99 /* BarToken */ ;
        }
    };
    Scanner.prototype.scanCaretToken = function () {
        this.slidingWindow.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 117 /* CaretEqualsToken */ ;
        } else {
            return 100 /* CaretToken */ ;
        }
    };
    Scanner.prototype.scanAmpersandToken = function () {
        this.slidingWindow.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 115 /* AmpersandEqualsToken */ ;
        } else if(this.currentCharCode() === 38 /* ampersand */ ) {
            this.slidingWindow.moveToNextItem();
            return 103 /* AmpersandAmpersandToken */ ;
        } else {
            return 98 /* AmpersandToken */ ;
        }
    };
    Scanner.prototype.scanPercentToken = function () {
        this.slidingWindow.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 111 /* PercentEqualsToken */ ;
        } else {
            return 92 /* PercentToken */ ;
        }
    };
    Scanner.prototype.scanMinusToken = function () {
        this.slidingWindow.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 109 /* MinusEqualsToken */ ;
        } else if(character === 45 /* minus */ ) {
            this.slidingWindow.moveToNextItem();
            return 94 /* MinusMinusToken */ ;
        } else {
            return 90 /* MinusToken */ ;
        }
    };
    Scanner.prototype.scanPlusToken = function () {
        this.slidingWindow.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 108 /* PlusEqualsToken */ ;
        } else if(character === 43 /* plus */ ) {
            this.slidingWindow.moveToNextItem();
            return 93 /* PlusPlusToken */ ;
        } else {
            return 89 /* PlusToken */ ;
        }
    };
    Scanner.prototype.scanAsteriskToken = function () {
        this.slidingWindow.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 110 /* AsteriskEqualsToken */ ;
        } else {
            return 91 /* AsteriskToken */ ;
        }
    };
    Scanner.prototype.scanEqualsToken = function () {
        this.slidingWindow.moveToNextItem();
        var character = this.currentCharCode();
        if(character === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            if(this.currentCharCode() === 61 /* equals */ ) {
                this.slidingWindow.moveToNextItem();
                return 87 /* EqualsEqualsEqualsToken */ ;
            } else {
                return 84 /* EqualsEqualsToken */ ;
            }
        } else if(character === 62 /* greaterThan */ ) {
            this.slidingWindow.moveToNextItem();
            return 85 /* EqualsGreaterThanToken */ ;
        } else {
            return 107 /* EqualsToken */ ;
        }
    };
    Scanner.prototype.isDotPrefixedNumericLiteral = function () {
        if(this.currentCharCode() === 46 /* dot */ ) {
            var ch = this.slidingWindow.peekItemN(1);
            return CharacterInfo.isDecimalDigit(ch);
        }
        return false;
    };
    Scanner.prototype.scanDotToken = function () {
        if(this.isDotPrefixedNumericLiteral()) {
            return this.scanNumericLiteral();
        }
        this.slidingWindow.moveToNextItem();
        if(this.currentCharCode() === 46 /* dot */  && this.slidingWindow.peekItemN(1) === 46 /* dot */ ) {
            this.slidingWindow.moveToNextItem();
            this.slidingWindow.moveToNextItem();
            return 77 /* DotDotDotToken */ ;
        } else {
            return 76 /* DotToken */ ;
        }
    };
    Scanner.prototype.scanSlashToken = function (allowRegularExpression) {
        if(allowRegularExpression) {
            var result = this.tryScanRegularExpressionToken();
            if(result !== 0 /* None */ ) {
                return result;
            }
        }
        this.slidingWindow.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            return 119 /* SlashEqualsToken */ ;
        } else {
            return 118 /* SlashToken */ ;
        }
    };
    Scanner.prototype.tryScanRegularExpressionToken = function () {
        Debug.assert(this.currentCharCode() === 47 /* slash */ );
        var startIndex = this.slidingWindow.getAndPinAbsoluteIndex();
        try  {
            this.slidingWindow.moveToNextItem();
            var inEscape = false;
            var inCharacterClass = false;
            while(true) {
                var ch = this.currentCharCode();
                if(this.isNewLineCharacter(ch) || this.slidingWindow.isAtEndOfSource()) {
                    this.slidingWindow.rewindToPinnedIndex(startIndex);
                    return 0 /* None */ ;
                }
                this.slidingWindow.moveToNextItem();
                if(inEscape) {
                    inEscape = false;
                    continue;
                }
                switch(ch) {
                    case 92 /* backslash */ :
                        inEscape = true;
                        continue;
                    case 91 /* openBracket */ :
                        inCharacterClass = true;
                        continue;
                    case 93 /* closeBracket */ :
                        inCharacterClass = false;
                        continue;
                    case 47 /* slash */ :
                        if(inCharacterClass) {
                            continue;
                        }
                        break;
                    default:
                        continue;
                }
                break;
            }
            while(Scanner.isIdentifierPartCharacter[this.currentCharCode()]) {
                this.slidingWindow.moveToNextItem();
            }
            return 12 /* RegularExpressionLiteral */ ;
        }finally {
            this.slidingWindow.releaseAndUnpinAbsoluteIndex(startIndex);
        }
    };
    Scanner.prototype.scanExclamationToken = function () {
        this.slidingWindow.moveToNextItem();
        if(this.currentCharCode() === 61 /* equals */ ) {
            this.slidingWindow.moveToNextItem();
            if(this.currentCharCode() === 61 /* equals */ ) {
                this.slidingWindow.moveToNextItem();
                return 88 /* ExclamationEqualsEqualsToken */ ;
            } else {
                return 86 /* ExclamationEqualsToken */ ;
            }
        } else {
            return 101 /* ExclamationToken */ ;
        }
    };
    Scanner.prototype.scanDefaultCharacter = function (character, diagnostics) {
        var position = this.slidingWindow.absoluteIndex();
        this.slidingWindow.moveToNextItem();
        var text = String.fromCharCode(character);
        var messageText = this.getErrorMessageText(text);
        diagnostics.push(new SyntaxDiagnostic(position, 1, 1 /* Unexpected_character_0 */ , [
            messageText
        ]));
        return 9 /* ErrorToken */ ;
    };
    Scanner.prototype.getErrorMessageText = function (text) {
        if(text === "\\") {
            return '"\\"';
        }
        return JSON2.stringify(text);
    };
    Scanner.prototype.skipEscapeSequence = function (diagnostics) {
        Debug.assert(this.currentCharCode() === 92 /* backslash */ );
        var rewindPoint = this.slidingWindow.getAndPinAbsoluteIndex();
        try  {
            this.slidingWindow.moveToNextItem();
            var ch = this.currentCharCode();
            this.slidingWindow.moveToNextItem();
            switch(ch) {
                case 120 /* x */ :
                case 117 /* u */ :
                    this.slidingWindow.rewindToPinnedIndex(rewindPoint);
                    var value = this.scanUnicodeOrHexEscape(diagnostics);
                    return;
                case 13 /* carriageReturn */ :
                    if(this.currentCharCode() === 10 /* lineFeed */ ) {
                        this.slidingWindow.moveToNextItem();
                    }
                    return;
                default:
                    return;
            }
        }finally {
            this.slidingWindow.releaseAndUnpinAbsoluteIndex(rewindPoint);
        }
    };
    Scanner.prototype.scanStringLiteral = function (diagnostics) {
        var quoteCharacter = this.currentCharCode();
        Debug.assert(quoteCharacter === 39 /* singleQuote */  || quoteCharacter === 34 /* doubleQuote */ );
        this.slidingWindow.moveToNextItem();
        while(true) {
            var ch = this.currentCharCode();
            if(ch === 92 /* backslash */ ) {
                this.skipEscapeSequence(diagnostics);
            } else if(ch === quoteCharacter) {
                this.slidingWindow.moveToNextItem();
                break;
            } else if(this.isNewLineCharacter(ch) || this.slidingWindow.isAtEndOfSource()) {
                diagnostics.push(new SyntaxDiagnostic(this.slidingWindow.absoluteIndex(), 1, 2 /* Missing_closing_quote_character */ , null));
                break;
            } else {
                this.slidingWindow.moveToNextItem();
            }
        }
        return 14 /* StringLiteral */ ;
    };
    Scanner.prototype.isUnicodeOrHexEscape = function (character) {
        return this.isUnicodeEscape(character) || this.isHexEscape(character);
    };
    Scanner.prototype.isUnicodeEscape = function (character) {
        if(character === 92 /* backslash */ ) {
            var ch2 = this.slidingWindow.peekItemN(1);
            if(ch2 === 117 /* u */ ) {
                return true;
            }
        }
        return false;
    };
    Scanner.prototype.isHexEscape = function (character) {
        if(character === 92 /* backslash */ ) {
            var ch2 = this.slidingWindow.peekItemN(1);
            if(ch2 === 120 /* x */ ) {
                return true;
            }
        }
        return false;
    };
    Scanner.prototype.peekCharOrUnicodeOrHexEscape = function () {
        var character = this.currentCharCode();
        if(this.isUnicodeOrHexEscape(character)) {
            return this.peekUnicodeOrHexEscape();
        } else {
            return character;
        }
    };
    Scanner.prototype.peekCharOrUnicodeEscape = function () {
        var character = this.currentCharCode();
        if(this.isUnicodeEscape(character)) {
            return this.peekUnicodeOrHexEscape();
        } else {
            return character;
        }
    };
    Scanner.prototype.peekUnicodeOrHexEscape = function () {
        var startIndex = this.slidingWindow.getAndPinAbsoluteIndex();
        var ch = this.scanUnicodeOrHexEscape(null);
        this.slidingWindow.rewindToPinnedIndex(startIndex);
        this.slidingWindow.releaseAndUnpinAbsoluteIndex(startIndex);
        return ch;
    };
    Scanner.prototype.scanCharOrUnicodeEscape = function (errors) {
        var ch = this.currentCharCode();
        if(ch === 92 /* backslash */ ) {
            var ch2 = this.slidingWindow.peekItemN(1);
            if(ch2 === 117 /* u */ ) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }
        this.slidingWindow.moveToNextItem();
        return ch;
    };
    Scanner.prototype.scanCharOrUnicodeOrHexEscape = function (errors) {
        var ch = this.currentCharCode();
        if(ch === 92 /* backslash */ ) {
            var ch2 = this.slidingWindow.peekItemN(1);
            if(ch2 === 117 /* u */  || ch2 === 120 /* x */ ) {
                return this.scanUnicodeOrHexEscape(errors);
            }
        }
        this.slidingWindow.moveToNextItem();
        return ch;
    };
    Scanner.prototype.scanUnicodeOrHexEscape = function (errors) {
        var start = this.slidingWindow.absoluteIndex();
        var character = this.currentCharCode();
        Debug.assert(character === 92 /* backslash */ );
        this.slidingWindow.moveToNextItem();
        character = this.currentCharCode();
        Debug.assert(character === 117 /* u */  || character === 120 /* x */ );
        var intChar = 0;
        this.slidingWindow.moveToNextItem();
        var count = character === 117 /* u */  ? 4 : 2;
        for(var i = 0; i < count; i++) {
            var ch2 = this.currentCharCode();
            if(!CharacterInfo.isHexDigit(ch2)) {
                if(errors !== null) {
                    var end = this.slidingWindow.absoluteIndex();
                    var info = this.createIllegalEscapeDiagnostic(start, end);
                    errors.push(info);
                }
                break;
            }
            intChar = (intChar << 4) + CharacterInfo.hexValue(ch2);
            this.slidingWindow.moveToNextItem();
        }
        return intChar;
    };
    Scanner.prototype.substring = function (start, end, intern) {
        var length = end - start;
        var offset = start - this.slidingWindow.windowAbsoluteStartIndex;
        Debug.assert(offset >= 0);
        if(intern) {
            return this.stringTable.addCharArray(this.slidingWindow.window, offset, length);
        } else {
            return StringUtilities.fromCharCodeArray(this.slidingWindow.window.slice(offset, offset + length));
        }
    };
    Scanner.prototype.createIllegalEscapeDiagnostic = function (start, end) {
        return new SyntaxDiagnostic(start, end - start, 0 /* Unrecognized_escape_sequence */ , null);
    };
    return Scanner;
})();
var Syntax;
(function (Syntax) {
    function realize(token) {
        return new RealizedToken(token.tokenKind, token.leadingTrivia(), token.text(), token.value(), token.trailingTrivia());
    }
    Syntax.realize = realize;
    function tokenToJSON(token) {
        var result = {
        };
        result.kind = (SyntaxKind)._map[token.kind()];
        result.width = token.width();
        if(token.fullWidth() !== token.width()) {
            result.fullWidth = token.fullWidth();
        }
        result.text = token.text();
        if(token.value() !== null) {
            result.valueText = token.value();
        }
        if(token.hasLeadingTrivia()) {
            result.hasLeadingTrivia = true;
        }
        if(token.hasLeadingComment()) {
            result.hasLeadingComment = true;
        }
        if(token.hasLeadingNewLine()) {
            result.hasLeadingNewLine = true;
        }
        if(token.hasLeadingSkippedText()) {
            result.hasLeadingSkippedText = true;
        }
        if(token.hasTrailingTrivia()) {
            result.hasTrailingTrivia = true;
        }
        if(token.hasTrailingComment()) {
            result.hasTrailingComment = true;
        }
        if(token.hasTrailingNewLine()) {
            result.hasTrailingNewLine = true;
        }
        if(token.hasTrailingSkippedText()) {
            result.hasTrailingSkippedText = true;
        }
        var trivia = token.leadingTrivia();
        if(trivia.count() > 0) {
            result.leadingTrivia = trivia;
        }
        trivia = token.trailingTrivia();
        if(trivia.count() > 0) {
            result.trailingTrivia = trivia;
        }
        return result;
    }
    Syntax.tokenToJSON = tokenToJSON;
    function value(token) {
        if(token.tokenKind === 11 /* IdentifierName */ ) {
            var text = token.text();
            for(var i = 0; i < text.length; i++) {
                if(!Scanner.isIdentifierPartCharacter[text.charCodeAt(i)]) {
                    return null;
                }
            }
            return text;
        } else if(token.tokenKind === 13 /* NumericLiteral */ ) {
            return null;
        } else if(token.tokenKind === 14 /* StringLiteral */ ) {
            return null;
        } else if(token.tokenKind === 12 /* RegularExpressionLiteral */ ) {
            return null;
        } else if(token.tokenKind === 10 /* EndOfFileToken */  || token.tokenKind === 9 /* ErrorToken */ ) {
            return null;
        } else {
            throw Errors.invalidOperation();
        }
    }
    Syntax.value = value;
    var EmptyToken = (function () {
        function EmptyToken(kind) {
            this.tokenKind = kind;
        }
        EmptyToken.prototype.clone = function () {
            return new EmptyToken(this.tokenKind);
        };
        EmptyToken.prototype.kind = function () {
            return this.tokenKind;
        };
        EmptyToken.prototype.isToken = function () {
            return true;
        };
        EmptyToken.prototype.isNode = function () {
            return false;
        };
        EmptyToken.prototype.isList = function () {
            return false;
        };
        EmptyToken.prototype.isSeparatedList = function () {
            return false;
        };
        EmptyToken.prototype.childCount = function () {
            return 0;
        };
        EmptyToken.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        EmptyToken.prototype.toJSON = function (key) {
            return tokenToJSON(this);
        };
        EmptyToken.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        EmptyToken.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        EmptyToken.prototype.firstToken = function () {
            return this;
        };
        EmptyToken.prototype.lastToken = function () {
            return this;
        };
        EmptyToken.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        EmptyToken.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        EmptyToken.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind);
        };
        EmptyToken.prototype.fullWidth = function () {
            return 0;
        };
        EmptyToken.prototype.width = function () {
            return 0;
        };
        EmptyToken.prototype.text = function () {
            return "";
        };
        EmptyToken.prototype.fullText = function () {
            return "";
        };
        EmptyToken.prototype.value = function () {
            return null;
        };
        EmptyToken.prototype.hasLeadingTrivia = function () {
            return false;
        };
        EmptyToken.prototype.hasLeadingComment = function () {
            return false;
        };
        EmptyToken.prototype.hasLeadingNewLine = function () {
            return false;
        };
        EmptyToken.prototype.hasLeadingSkippedText = function () {
            return false;
        };
        EmptyToken.prototype.leadingTriviaWidth = function () {
            return 0;
        };
        EmptyToken.prototype.hasTrailingTrivia = function () {
            return false;
        };
        EmptyToken.prototype.hasTrailingComment = function () {
            return false;
        };
        EmptyToken.prototype.hasTrailingNewLine = function () {
            return false;
        };
        EmptyToken.prototype.hasTrailingSkippedText = function () {
            return false;
        };
        EmptyToken.prototype.hasSkippedText = function () {
            return false;
        };
        EmptyToken.prototype.trailingTriviaWidth = function () {
            return 0;
        };
        EmptyToken.prototype.leadingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        EmptyToken.prototype.trailingTrivia = function () {
            return Syntax.emptyTriviaList;
        };
        EmptyToken.prototype.realize = function () {
            return realize(this);
        };
        EmptyToken.prototype.collectTextElements = function (elements) {
        };
        EmptyToken.prototype.withLeadingTrivia = function (leadingTrivia) {
            return this.realize().withLeadingTrivia(leadingTrivia);
        };
        EmptyToken.prototype.withTrailingTrivia = function (trailingTrivia) {
            return this.realize().withTrailingTrivia(trailingTrivia);
        };
        return EmptyToken;
    })();    
    function emptyToken(kind) {
        return new EmptyToken(kind);
    }
    Syntax.emptyToken = emptyToken;
    var RealizedToken = (function () {
        function RealizedToken(tokenKind, leadingTrivia, text, value, trailingTrivia) {
            this.tokenKind = tokenKind;
            this._leadingTrivia = leadingTrivia;
            this._text = text;
            this._value = value;
            this._trailingTrivia = trailingTrivia;
        }
        RealizedToken.prototype.clone = function () {
            return new RealizedToken(this.tokenKind, this._leadingTrivia, this._text, this._value, this._trailingTrivia);
        };
        RealizedToken.prototype.kind = function () {
            return this.tokenKind;
        };
        RealizedToken.prototype.toJSON = function (key) {
            return tokenToJSON(this);
        };
        RealizedToken.prototype.firstToken = function () {
            return this;
        };
        RealizedToken.prototype.lastToken = function () {
            return this;
        };
        RealizedToken.prototype.isTypeScriptSpecific = function () {
            return false;
        };
        RealizedToken.prototype.hasZeroWidthToken = function () {
            return this.fullWidth() === 0;
        };
        RealizedToken.prototype.hasRegularExpressionToken = function () {
            return SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.kind());
        };
        RealizedToken.prototype.accept = function (visitor) {
            return visitor.visitToken(this);
        };
        RealizedToken.prototype.childCount = function () {
            return 0;
        };
        RealizedToken.prototype.childAt = function (index) {
            throw Errors.argumentOutOfRange("index");
        };
        RealizedToken.prototype.isToken = function () {
            return true;
        };
        RealizedToken.prototype.isNode = function () {
            return false;
        };
        RealizedToken.prototype.isList = function () {
            return false;
        };
        RealizedToken.prototype.isSeparatedList = function () {
            return false;
        };
        RealizedToken.prototype.isTrivia = function () {
            return false;
        };
        RealizedToken.prototype.isTriviaList = function () {
            return false;
        };
        RealizedToken.prototype.fullWidth = function () {
            return this._leadingTrivia.fullWidth() + this.width() + this._trailingTrivia.fullWidth();
        };
        RealizedToken.prototype.width = function () {
            return this.text().length;
        };
        RealizedToken.prototype.text = function () {
            return this._text;
        };
        RealizedToken.prototype.fullText = function () {
            return this._leadingTrivia.fullText() + this.text() + this._trailingTrivia.fullText();
        };
        RealizedToken.prototype.value = function () {
            return this._value;
        };
        RealizedToken.prototype.hasLeadingTrivia = function () {
            return this._leadingTrivia.count() > 0;
        };
        RealizedToken.prototype.hasLeadingComment = function () {
            return this._leadingTrivia.hasComment();
        };
        RealizedToken.prototype.hasLeadingNewLine = function () {
            return this._leadingTrivia.hasNewLine();
        };
        RealizedToken.prototype.hasLeadingSkippedText = function () {
            return this._leadingTrivia.hasSkippedText();
        };
        RealizedToken.prototype.leadingTriviaWidth = function () {
            return this._leadingTrivia.fullWidth();
        };
        RealizedToken.prototype.hasTrailingTrivia = function () {
            return this._trailingTrivia.count() > 0;
        };
        RealizedToken.prototype.hasTrailingComment = function () {
            return this._trailingTrivia.hasComment();
        };
        RealizedToken.prototype.hasTrailingNewLine = function () {
            return this._trailingTrivia.hasNewLine();
        };
        RealizedToken.prototype.hasTrailingSkippedText = function () {
            return this._trailingTrivia.hasSkippedText();
        };
        RealizedToken.prototype.trailingTriviaWidth = function () {
            return this._trailingTrivia.fullWidth();
        };
        RealizedToken.prototype.hasSkippedText = function () {
            return this.hasLeadingSkippedText() || this.hasTrailingSkippedText();
        };
        RealizedToken.prototype.leadingTrivia = function () {
            return this._leadingTrivia;
        };
        RealizedToken.prototype.trailingTrivia = function () {
            return this._trailingTrivia;
        };
        RealizedToken.prototype.findTokenInternal = function (parent, position, fullStart) {
            return new PositionedToken(parent, this, fullStart);
        };
        RealizedToken.prototype.collectTextElements = function (elements) {
            this.leadingTrivia().collectTextElements(elements);
            elements.push(this.text());
            this.trailingTrivia().collectTextElements(elements);
        };
        RealizedToken.prototype.withLeadingTrivia = function (leadingTrivia) {
            return new RealizedToken(this.tokenKind, leadingTrivia, this._text, this._value, this._trailingTrivia);
        };
        RealizedToken.prototype.withTrailingTrivia = function (trailingTrivia) {
            return new RealizedToken(this.tokenKind, this._leadingTrivia, this._text, this._value, trailingTrivia);
        };
        return RealizedToken;
    })();    
    function token(kind, info) {
        if (typeof info === "undefined") { info = null; }
        var text = (info !== null && info.text !== undefined) ? info.text : SyntaxFacts.getText(kind);
        var value = (info !== null && info.value !== undefined) ? info.value : null;
        return new RealizedToken(kind, Syntax.triviaList(info === null ? null : info.leadingTrivia), text, value, Syntax.triviaList(info === null ? null : info.trailingTrivia));
    }
    Syntax.token = token;
    function identifier(text, info) {
        if (typeof info === "undefined") { info = null; }
        info = info || {
        };
        info.text = text;
        return token(11 /* IdentifierName */ , info);
    }
    Syntax.identifier = identifier;
})(Syntax || (Syntax = {}));
var Syntax;
(function (Syntax) {
    var NormalModeFactory = (function () {
        function NormalModeFactory() { }
        NormalModeFactory.prototype.sourceUnit = function (moduleElements, endOfFileToken) {
            return new SourceUnitSyntax(moduleElements, endOfFileToken, false);
        };
        NormalModeFactory.prototype.externalModuleReference = function (moduleKeyword, openParenToken, stringLiteral, closeParenToken) {
            return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, false);
        };
        NormalModeFactory.prototype.moduleNameModuleReference = function (moduleName) {
            return new ModuleNameModuleReferenceSyntax(moduleName, false);
        };
        NormalModeFactory.prototype.importDeclaration = function (importKeyword, identifier, equalsToken, moduleReference, semicolonToken) {
            return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, false);
        };
        NormalModeFactory.prototype.classDeclaration = function (exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken) {
            return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, false);
        };
        NormalModeFactory.prototype.interfaceDeclaration = function (exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body) {
            return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body, false);
        };
        NormalModeFactory.prototype.extendsClause = function (extendsKeyword, typeNames) {
            return new ExtendsClauseSyntax(extendsKeyword, typeNames, false);
        };
        NormalModeFactory.prototype.implementsClause = function (implementsKeyword, typeNames) {
            return new ImplementsClauseSyntax(implementsKeyword, typeNames, false);
        };
        NormalModeFactory.prototype.moduleDeclaration = function (exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken) {
            return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken, false);
        };
        NormalModeFactory.prototype.functionDeclaration = function (exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken) {
            return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken, false);
        };
        NormalModeFactory.prototype.variableStatement = function (exportKeyword, declareKeyword, variableDeclaration, semicolonToken) {
            return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken, false);
        };
        NormalModeFactory.prototype.variableDeclaration = function (varKeyword, variableDeclarators) {
            return new VariableDeclarationSyntax(varKeyword, variableDeclarators, false);
        };
        NormalModeFactory.prototype.variableDeclarator = function (identifier, typeAnnotation, equalsValueClause) {
            return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause, false);
        };
        NormalModeFactory.prototype.equalsValueClause = function (equalsToken, value) {
            return new EqualsValueClauseSyntax(equalsToken, value, false);
        };
        NormalModeFactory.prototype.prefixUnaryExpression = function (kind, operatorToken, operand) {
            return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand, false);
        };
        NormalModeFactory.prototype.arrayLiteralExpression = function (openBracketToken, expressions, closeBracketToken) {
            return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken, false);
        };
        NormalModeFactory.prototype.omittedExpression = function () {
            return new OmittedExpressionSyntax(false);
        };
        NormalModeFactory.prototype.parenthesizedExpression = function (openParenToken, expression, closeParenToken) {
            return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken, false);
        };
        NormalModeFactory.prototype.simpleArrowFunctionExpression = function (identifier, equalsGreaterThanToken, body) {
            return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, false);
        };
        NormalModeFactory.prototype.parenthesizedArrowFunctionExpression = function (callSignature, equalsGreaterThanToken, body) {
            return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, false);
        };
        NormalModeFactory.prototype.qualifiedName = function (left, dotToken, right) {
            return new QualifiedNameSyntax(left, dotToken, right, false);
        };
        NormalModeFactory.prototype.typeArgumentList = function (lessThanToken, typeArguments, greaterThanToken) {
            return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, false);
        };
        NormalModeFactory.prototype.constructorType = function (newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type) {
            return new ConstructorTypeSyntax(newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type, false);
        };
        NormalModeFactory.prototype.functionType = function (typeParameterList, parameterList, equalsGreaterThanToken, type) {
            return new FunctionTypeSyntax(typeParameterList, parameterList, equalsGreaterThanToken, type, false);
        };
        NormalModeFactory.prototype.objectType = function (openBraceToken, typeMembers, closeBraceToken) {
            return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, false);
        };
        NormalModeFactory.prototype.arrayType = function (type, openBracketToken, closeBracketToken) {
            return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, false);
        };
        NormalModeFactory.prototype.genericType = function (name, typeArgumentList) {
            return new GenericTypeSyntax(name, typeArgumentList, false);
        };
        NormalModeFactory.prototype.typeAnnotation = function (colonToken, type) {
            return new TypeAnnotationSyntax(colonToken, type, false);
        };
        NormalModeFactory.prototype.block = function (openBraceToken, statements, closeBraceToken) {
            return new BlockSyntax(openBraceToken, statements, closeBraceToken, false);
        };
        NormalModeFactory.prototype.parameter = function (dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause) {
            return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause, false);
        };
        NormalModeFactory.prototype.memberAccessExpression = function (expression, dotToken, name) {
            return new MemberAccessExpressionSyntax(expression, dotToken, name, false);
        };
        NormalModeFactory.prototype.postfixUnaryExpression = function (kind, operand, operatorToken) {
            return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken, false);
        };
        NormalModeFactory.prototype.elementAccessExpression = function (expression, openBracketToken, argumentExpression, closeBracketToken) {
            return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken, false);
        };
        NormalModeFactory.prototype.invocationExpression = function (expression, argumentList) {
            return new InvocationExpressionSyntax(expression, argumentList, false);
        };
        NormalModeFactory.prototype.argumentList = function (typeArgumentList, openParenToken, _arguments, closeParenToken) {
            return new ArgumentListSyntax(typeArgumentList, openParenToken, _arguments, closeParenToken, false);
        };
        NormalModeFactory.prototype.binaryExpression = function (kind, left, operatorToken, right) {
            return new BinaryExpressionSyntax(kind, left, operatorToken, right, false);
        };
        NormalModeFactory.prototype.conditionalExpression = function (condition, questionToken, whenTrue, colonToken, whenFalse) {
            return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, false);
        };
        NormalModeFactory.prototype.constructSignature = function (newKeyword, callSignature) {
            return new ConstructSignatureSyntax(newKeyword, callSignature, false);
        };
        NormalModeFactory.prototype.functionSignature = function (identifier, questionToken, callSignature) {
            return new FunctionSignatureSyntax(identifier, questionToken, callSignature, false);
        };
        NormalModeFactory.prototype.indexSignature = function (openBracketToken, parameter, closeBracketToken, typeAnnotation) {
            return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation, false);
        };
        NormalModeFactory.prototype.propertySignature = function (identifier, questionToken, typeAnnotation) {
            return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation, false);
        };
        NormalModeFactory.prototype.parameterList = function (openParenToken, parameters, closeParenToken) {
            return new ParameterListSyntax(openParenToken, parameters, closeParenToken, false);
        };
        NormalModeFactory.prototype.callSignature = function (typeParameterList, parameterList, typeAnnotation) {
            return new CallSignatureSyntax(typeParameterList, parameterList, typeAnnotation, false);
        };
        NormalModeFactory.prototype.typeParameterList = function (lessThanToken, typeParameters, greaterThanToken) {
            return new TypeParameterListSyntax(lessThanToken, typeParameters, greaterThanToken, false);
        };
        NormalModeFactory.prototype.typeParameter = function (identifier, constraint) {
            return new TypeParameterSyntax(identifier, constraint, false);
        };
        NormalModeFactory.prototype.constraint = function (extendsKeyword, type) {
            return new ConstraintSyntax(extendsKeyword, type, false);
        };
        NormalModeFactory.prototype.elseClause = function (elseKeyword, statement) {
            return new ElseClauseSyntax(elseKeyword, statement, false);
        };
        NormalModeFactory.prototype.ifStatement = function (ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause) {
            return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause, false);
        };
        NormalModeFactory.prototype.expressionStatement = function (expression, semicolonToken) {
            return new ExpressionStatementSyntax(expression, semicolonToken, false);
        };
        NormalModeFactory.prototype.constructorDeclaration = function (constructorKeyword, parameterList, block, semicolonToken) {
            return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken, false);
        };
        NormalModeFactory.prototype.memberFunctionDeclaration = function (publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken) {
            return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken, false);
        };
        NormalModeFactory.prototype.getMemberAccessorDeclaration = function (publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block) {
            return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block, false);
        };
        NormalModeFactory.prototype.setMemberAccessorDeclaration = function (publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block) {
            return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block, false);
        };
        NormalModeFactory.prototype.memberVariableDeclaration = function (publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken) {
            return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken, false);
        };
        NormalModeFactory.prototype.throwStatement = function (throwKeyword, expression, semicolonToken) {
            return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken, false);
        };
        NormalModeFactory.prototype.returnStatement = function (returnKeyword, expression, semicolonToken) {
            return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken, false);
        };
        NormalModeFactory.prototype.objectCreationExpression = function (newKeyword, expression, argumentList) {
            return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList, false);
        };
        NormalModeFactory.prototype.switchStatement = function (switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken) {
            return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken, false);
        };
        NormalModeFactory.prototype.caseSwitchClause = function (caseKeyword, expression, colonToken, statements) {
            return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements, false);
        };
        NormalModeFactory.prototype.defaultSwitchClause = function (defaultKeyword, colonToken, statements) {
            return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements, false);
        };
        NormalModeFactory.prototype.breakStatement = function (breakKeyword, identifier, semicolonToken) {
            return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken, false);
        };
        NormalModeFactory.prototype.continueStatement = function (continueKeyword, identifier, semicolonToken) {
            return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken, false);
        };
        NormalModeFactory.prototype.forStatement = function (forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement) {
            return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement, false);
        };
        NormalModeFactory.prototype.forInStatement = function (forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement) {
            return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement, false);
        };
        NormalModeFactory.prototype.whileStatement = function (whileKeyword, openParenToken, condition, closeParenToken, statement) {
            return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement, false);
        };
        NormalModeFactory.prototype.withStatement = function (withKeyword, openParenToken, condition, closeParenToken, statement) {
            return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement, false);
        };
        NormalModeFactory.prototype.enumDeclaration = function (exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken) {
            return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken, false);
        };
        NormalModeFactory.prototype.castExpression = function (lessThanToken, type, greaterThanToken, expression) {
            return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, false);
        };
        NormalModeFactory.prototype.objectLiteralExpression = function (openBraceToken, propertyAssignments, closeBraceToken) {
            return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, false);
        };
        NormalModeFactory.prototype.simplePropertyAssignment = function (propertyName, colonToken, expression) {
            return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, false);
        };
        NormalModeFactory.prototype.getAccessorPropertyAssignment = function (getKeyword, propertyName, openParenToken, closeParenToken, block) {
            return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block, false);
        };
        NormalModeFactory.prototype.setAccessorPropertyAssignment = function (setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block) {
            return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block, false);
        };
        NormalModeFactory.prototype.functionExpression = function (functionKeyword, identifier, callSignature, block) {
            return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block, false);
        };
        NormalModeFactory.prototype.emptyStatement = function (semicolonToken) {
            return new EmptyStatementSyntax(semicolonToken, false);
        };
        NormalModeFactory.prototype.tryStatement = function (tryKeyword, block, catchClause, finallyClause) {
            return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause, false);
        };
        NormalModeFactory.prototype.catchClause = function (catchKeyword, openParenToken, identifier, closeParenToken, block) {
            return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block, false);
        };
        NormalModeFactory.prototype.finallyClause = function (finallyKeyword, block) {
            return new FinallyClauseSyntax(finallyKeyword, block, false);
        };
        NormalModeFactory.prototype.labeledStatement = function (identifier, colonToken, statement) {
            return new LabeledStatementSyntax(identifier, colonToken, statement, false);
        };
        NormalModeFactory.prototype.doStatement = function (doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken) {
            return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken, false);
        };
        NormalModeFactory.prototype.typeOfExpression = function (typeOfKeyword, expression) {
            return new TypeOfExpressionSyntax(typeOfKeyword, expression, false);
        };
        NormalModeFactory.prototype.deleteExpression = function (deleteKeyword, expression) {
            return new DeleteExpressionSyntax(deleteKeyword, expression, false);
        };
        NormalModeFactory.prototype.voidExpression = function (voidKeyword, expression) {
            return new VoidExpressionSyntax(voidKeyword, expression, false);
        };
        NormalModeFactory.prototype.debuggerStatement = function (debuggerKeyword, semicolonToken) {
            return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken, false);
        };
        return NormalModeFactory;
    })();    
    var StrictModeFactory = (function () {
        function StrictModeFactory() { }
        StrictModeFactory.prototype.sourceUnit = function (moduleElements, endOfFileToken) {
            return new SourceUnitSyntax(moduleElements, endOfFileToken, true);
        };
        StrictModeFactory.prototype.externalModuleReference = function (moduleKeyword, openParenToken, stringLiteral, closeParenToken) {
            return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, true);
        };
        StrictModeFactory.prototype.moduleNameModuleReference = function (moduleName) {
            return new ModuleNameModuleReferenceSyntax(moduleName, true);
        };
        StrictModeFactory.prototype.importDeclaration = function (importKeyword, identifier, equalsToken, moduleReference, semicolonToken) {
            return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, true);
        };
        StrictModeFactory.prototype.classDeclaration = function (exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken) {
            return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, true);
        };
        StrictModeFactory.prototype.interfaceDeclaration = function (exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body) {
            return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body, true);
        };
        StrictModeFactory.prototype.extendsClause = function (extendsKeyword, typeNames) {
            return new ExtendsClauseSyntax(extendsKeyword, typeNames, true);
        };
        StrictModeFactory.prototype.implementsClause = function (implementsKeyword, typeNames) {
            return new ImplementsClauseSyntax(implementsKeyword, typeNames, true);
        };
        StrictModeFactory.prototype.moduleDeclaration = function (exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken) {
            return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken, true);
        };
        StrictModeFactory.prototype.functionDeclaration = function (exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken) {
            return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken, true);
        };
        StrictModeFactory.prototype.variableStatement = function (exportKeyword, declareKeyword, variableDeclaration, semicolonToken) {
            return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken, true);
        };
        StrictModeFactory.prototype.variableDeclaration = function (varKeyword, variableDeclarators) {
            return new VariableDeclarationSyntax(varKeyword, variableDeclarators, true);
        };
        StrictModeFactory.prototype.variableDeclarator = function (identifier, typeAnnotation, equalsValueClause) {
            return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause, true);
        };
        StrictModeFactory.prototype.equalsValueClause = function (equalsToken, value) {
            return new EqualsValueClauseSyntax(equalsToken, value, true);
        };
        StrictModeFactory.prototype.prefixUnaryExpression = function (kind, operatorToken, operand) {
            return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand, true);
        };
        StrictModeFactory.prototype.arrayLiteralExpression = function (openBracketToken, expressions, closeBracketToken) {
            return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken, true);
        };
        StrictModeFactory.prototype.omittedExpression = function () {
            return new OmittedExpressionSyntax(true);
        };
        StrictModeFactory.prototype.parenthesizedExpression = function (openParenToken, expression, closeParenToken) {
            return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken, true);
        };
        StrictModeFactory.prototype.simpleArrowFunctionExpression = function (identifier, equalsGreaterThanToken, body) {
            return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, true);
        };
        StrictModeFactory.prototype.parenthesizedArrowFunctionExpression = function (callSignature, equalsGreaterThanToken, body) {
            return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, true);
        };
        StrictModeFactory.prototype.qualifiedName = function (left, dotToken, right) {
            return new QualifiedNameSyntax(left, dotToken, right, true);
        };
        StrictModeFactory.prototype.typeArgumentList = function (lessThanToken, typeArguments, greaterThanToken) {
            return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, true);
        };
        StrictModeFactory.prototype.constructorType = function (newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type) {
            return new ConstructorTypeSyntax(newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type, true);
        };
        StrictModeFactory.prototype.functionType = function (typeParameterList, parameterList, equalsGreaterThanToken, type) {
            return new FunctionTypeSyntax(typeParameterList, parameterList, equalsGreaterThanToken, type, true);
        };
        StrictModeFactory.prototype.objectType = function (openBraceToken, typeMembers, closeBraceToken) {
            return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, true);
        };
        StrictModeFactory.prototype.arrayType = function (type, openBracketToken, closeBracketToken) {
            return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, true);
        };
        StrictModeFactory.prototype.genericType = function (name, typeArgumentList) {
            return new GenericTypeSyntax(name, typeArgumentList, true);
        };
        StrictModeFactory.prototype.typeAnnotation = function (colonToken, type) {
            return new TypeAnnotationSyntax(colonToken, type, true);
        };
        StrictModeFactory.prototype.block = function (openBraceToken, statements, closeBraceToken) {
            return new BlockSyntax(openBraceToken, statements, closeBraceToken, true);
        };
        StrictModeFactory.prototype.parameter = function (dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause) {
            return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause, true);
        };
        StrictModeFactory.prototype.memberAccessExpression = function (expression, dotToken, name) {
            return new MemberAccessExpressionSyntax(expression, dotToken, name, true);
        };
        StrictModeFactory.prototype.postfixUnaryExpression = function (kind, operand, operatorToken) {
            return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken, true);
        };
        StrictModeFactory.prototype.elementAccessExpression = function (expression, openBracketToken, argumentExpression, closeBracketToken) {
            return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken, true);
        };
        StrictModeFactory.prototype.invocationExpression = function (expression, argumentList) {
            return new InvocationExpressionSyntax(expression, argumentList, true);
        };
        StrictModeFactory.prototype.argumentList = function (typeArgumentList, openParenToken, _arguments, closeParenToken) {
            return new ArgumentListSyntax(typeArgumentList, openParenToken, _arguments, closeParenToken, true);
        };
        StrictModeFactory.prototype.binaryExpression = function (kind, left, operatorToken, right) {
            return new BinaryExpressionSyntax(kind, left, operatorToken, right, true);
        };
        StrictModeFactory.prototype.conditionalExpression = function (condition, questionToken, whenTrue, colonToken, whenFalse) {
            return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, true);
        };
        StrictModeFactory.prototype.constructSignature = function (newKeyword, callSignature) {
            return new ConstructSignatureSyntax(newKeyword, callSignature, true);
        };
        StrictModeFactory.prototype.functionSignature = function (identifier, questionToken, callSignature) {
            return new FunctionSignatureSyntax(identifier, questionToken, callSignature, true);
        };
        StrictModeFactory.prototype.indexSignature = function (openBracketToken, parameter, closeBracketToken, typeAnnotation) {
            return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation, true);
        };
        StrictModeFactory.prototype.propertySignature = function (identifier, questionToken, typeAnnotation) {
            return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation, true);
        };
        StrictModeFactory.prototype.parameterList = function (openParenToken, parameters, closeParenToken) {
            return new ParameterListSyntax(openParenToken, parameters, closeParenToken, true);
        };
        StrictModeFactory.prototype.callSignature = function (typeParameterList, parameterList, typeAnnotation) {
            return new CallSignatureSyntax(typeParameterList, parameterList, typeAnnotation, true);
        };
        StrictModeFactory.prototype.typeParameterList = function (lessThanToken, typeParameters, greaterThanToken) {
            return new TypeParameterListSyntax(lessThanToken, typeParameters, greaterThanToken, true);
        };
        StrictModeFactory.prototype.typeParameter = function (identifier, constraint) {
            return new TypeParameterSyntax(identifier, constraint, true);
        };
        StrictModeFactory.prototype.constraint = function (extendsKeyword, type) {
            return new ConstraintSyntax(extendsKeyword, type, true);
        };
        StrictModeFactory.prototype.elseClause = function (elseKeyword, statement) {
            return new ElseClauseSyntax(elseKeyword, statement, true);
        };
        StrictModeFactory.prototype.ifStatement = function (ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause) {
            return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause, true);
        };
        StrictModeFactory.prototype.expressionStatement = function (expression, semicolonToken) {
            return new ExpressionStatementSyntax(expression, semicolonToken, true);
        };
        StrictModeFactory.prototype.constructorDeclaration = function (constructorKeyword, parameterList, block, semicolonToken) {
            return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken, true);
        };
        StrictModeFactory.prototype.memberFunctionDeclaration = function (publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken) {
            return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken, true);
        };
        StrictModeFactory.prototype.getMemberAccessorDeclaration = function (publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block) {
            return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block, true);
        };
        StrictModeFactory.prototype.setMemberAccessorDeclaration = function (publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block) {
            return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block, true);
        };
        StrictModeFactory.prototype.memberVariableDeclaration = function (publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken) {
            return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken, true);
        };
        StrictModeFactory.prototype.throwStatement = function (throwKeyword, expression, semicolonToken) {
            return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken, true);
        };
        StrictModeFactory.prototype.returnStatement = function (returnKeyword, expression, semicolonToken) {
            return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken, true);
        };
        StrictModeFactory.prototype.objectCreationExpression = function (newKeyword, expression, argumentList) {
            return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList, true);
        };
        StrictModeFactory.prototype.switchStatement = function (switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken) {
            return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken, true);
        };
        StrictModeFactory.prototype.caseSwitchClause = function (caseKeyword, expression, colonToken, statements) {
            return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements, true);
        };
        StrictModeFactory.prototype.defaultSwitchClause = function (defaultKeyword, colonToken, statements) {
            return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements, true);
        };
        StrictModeFactory.prototype.breakStatement = function (breakKeyword, identifier, semicolonToken) {
            return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken, true);
        };
        StrictModeFactory.prototype.continueStatement = function (continueKeyword, identifier, semicolonToken) {
            return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken, true);
        };
        StrictModeFactory.prototype.forStatement = function (forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement) {
            return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement, true);
        };
        StrictModeFactory.prototype.forInStatement = function (forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement) {
            return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement, true);
        };
        StrictModeFactory.prototype.whileStatement = function (whileKeyword, openParenToken, condition, closeParenToken, statement) {
            return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement, true);
        };
        StrictModeFactory.prototype.withStatement = function (withKeyword, openParenToken, condition, closeParenToken, statement) {
            return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement, true);
        };
        StrictModeFactory.prototype.enumDeclaration = function (exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken) {
            return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken, true);
        };
        StrictModeFactory.prototype.castExpression = function (lessThanToken, type, greaterThanToken, expression) {
            return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, true);
        };
        StrictModeFactory.prototype.objectLiteralExpression = function (openBraceToken, propertyAssignments, closeBraceToken) {
            return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, true);
        };
        StrictModeFactory.prototype.simplePropertyAssignment = function (propertyName, colonToken, expression) {
            return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, true);
        };
        StrictModeFactory.prototype.getAccessorPropertyAssignment = function (getKeyword, propertyName, openParenToken, closeParenToken, block) {
            return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block, true);
        };
        StrictModeFactory.prototype.setAccessorPropertyAssignment = function (setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block) {
            return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block, true);
        };
        StrictModeFactory.prototype.functionExpression = function (functionKeyword, identifier, callSignature, block) {
            return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block, true);
        };
        StrictModeFactory.prototype.emptyStatement = function (semicolonToken) {
            return new EmptyStatementSyntax(semicolonToken, true);
        };
        StrictModeFactory.prototype.tryStatement = function (tryKeyword, block, catchClause, finallyClause) {
            return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause, true);
        };
        StrictModeFactory.prototype.catchClause = function (catchKeyword, openParenToken, identifier, closeParenToken, block) {
            return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block, true);
        };
        StrictModeFactory.prototype.finallyClause = function (finallyKeyword, block) {
            return new FinallyClauseSyntax(finallyKeyword, block, true);
        };
        StrictModeFactory.prototype.labeledStatement = function (identifier, colonToken, statement) {
            return new LabeledStatementSyntax(identifier, colonToken, statement, true);
        };
        StrictModeFactory.prototype.doStatement = function (doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken) {
            return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken, true);
        };
        StrictModeFactory.prototype.typeOfExpression = function (typeOfKeyword, expression) {
            return new TypeOfExpressionSyntax(typeOfKeyword, expression, true);
        };
        StrictModeFactory.prototype.deleteExpression = function (deleteKeyword, expression) {
            return new DeleteExpressionSyntax(deleteKeyword, expression, true);
        };
        StrictModeFactory.prototype.voidExpression = function (voidKeyword, expression) {
            return new VoidExpressionSyntax(voidKeyword, expression, true);
        };
        StrictModeFactory.prototype.debuggerStatement = function (debuggerKeyword, semicolonToken) {
            return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken, true);
        };
        return StrictModeFactory;
    })();    
    Syntax.normalModeFactory = new NormalModeFactory();
    Syntax.strictModeFactory = new StrictModeFactory();
})(Syntax || (Syntax = {}));
var Syntax;
(function (Syntax) {
    function emptySourceUnit() {
        return Syntax.normalModeFactory.sourceUnit(Syntax.emptyList, Syntax.token(10 /* EndOfFileToken */ , {
            text: ""
        }));
    }
    Syntax.emptySourceUnit = emptySourceUnit;
    function getStandaloneExpression(positionedToken) {
        var token = positionedToken.token();
        if(positionedToken !== null && positionedToken.kind() === 11 /* IdentifierName */ ) {
            var parentPositionedNode = positionedToken.containingNode();
            var parentNode = parentPositionedNode.node();
            if(parentNode.kind() === 121 /* QualifiedName */  && (parentNode).right === token) {
                return parentPositionedNode;
            } else if(parentNode.kind() === 209 /* MemberAccessExpression */  && (parentNode).name === token) {
                return parentPositionedNode;
            }
        }
        return positionedToken;
    }
    Syntax.getStandaloneExpression = getStandaloneExpression;
    function isInModuleOrTypeContext(positionedToken) {
        if(positionedToken !== null) {
            var positionedNodeOrToken = Syntax.getStandaloneExpression(positionedToken);
            var parent = positionedNodeOrToken.containingNode();
            if(parent !== null) {
                switch(parent.kind()) {
                    case 241 /* ModuleNameModuleReference */ :
                        return true;
                    case 121 /* QualifiedName */ :
                        return true;
                    default:
                        return isInTypeOnlyContext(positionedToken);
                }
            }
        }
        return false;
    }
    Syntax.isInModuleOrTypeContext = isInModuleOrTypeContext;
    function isInTypeOnlyContext(positionedToken) {
        var positionedNodeOrToken = Syntax.getStandaloneExpression(positionedToken);
        var positionedParent = positionedNodeOrToken.containingNode();
        var parent = positionedParent.node();
        var nodeOrToken = positionedNodeOrToken.nodeOrToken();
        if(parent !== null) {
            switch(parent.kind()) {
                case 124 /* ArrayType */ :
                    return (parent).type === nodeOrToken;
                case 217 /* CastExpression */ :
                    return (parent).type === nodeOrToken;
                case 238 /* TypeAnnotation */ :
                case 228 /* ExtendsClause */ :
                case 227 /* ImplementsClause */ :
                case 225 /* TypeArgumentList */ :
                    return true;
            }
        }
        return false;
    }
    Syntax.isInTypeOnlyContext = isInTypeOnlyContext;
    function childOffset(parent, child) {
        var offset = 0;
        for(var i = 0, n = parent.childCount(); i < n; i++) {
            var current = parent.childAt(i);
            if(current === child) {
                return offset;
            }
            if(current !== null) {
                offset += current.fullWidth();
            }
        }
        throw Errors.invalidOperation();
    }
    Syntax.childOffset = childOffset;
    function nodeStructuralEquals(node1, node2) {
        if(node1 === null) {
            return node2 === null;
        }
        return node1.structuralEquals(node2);
    }
    Syntax.nodeStructuralEquals = nodeStructuralEquals;
    function nodeOrTokenStructuralEquals(node1, node2) {
        if(node1 === node2) {
            return true;
        }
        if(node1 === null || node2 === null) {
            return false;
        }
        if(node1.isToken()) {
            return node2.isToken() ? tokenStructuralEquals(node1, node2) : false;
        }
        return node2.isNode() ? nodeStructuralEquals(node1, node2) : false;
    }
    Syntax.nodeOrTokenStructuralEquals = nodeOrTokenStructuralEquals;
    function tokenStructuralEquals(token1, token2) {
        if(token1 === token2) {
            return true;
        }
        if(token1 === null || token2 === null) {
            return false;
        }
        return token1.kind() === token2.kind() && token1.width() === token2.width() && token1.fullWidth() === token2.fullWidth() && token1.text() === token2.text() && Syntax.triviaListStructuralEquals(token1.leadingTrivia(), token2.leadingTrivia()) && Syntax.triviaListStructuralEquals(token1.trailingTrivia(), token2.trailingTrivia());
    }
    Syntax.tokenStructuralEquals = tokenStructuralEquals;
    function triviaListStructuralEquals(triviaList1, triviaList2) {
        if(triviaList1.count() !== triviaList2.count()) {
            return false;
        }
        for(var i = 0, n = triviaList1.count(); i < n; i++) {
            if(!Syntax.triviaStructuralEquals(triviaList1.syntaxTriviaAt(i), triviaList2.syntaxTriviaAt(i))) {
                return false;
            }
        }
        return true;
    }
    Syntax.triviaListStructuralEquals = triviaListStructuralEquals;
    function triviaStructuralEquals(trivia1, trivia2) {
        return trivia1.kind() === trivia2.kind() && trivia1.fullWidth() === trivia2.fullWidth() && trivia1.fullText() === trivia2.fullText();
    }
    Syntax.triviaStructuralEquals = triviaStructuralEquals;
    function listStructuralEquals(list1, list2) {
        if(list1.childCount() !== list2.childCount()) {
            return false;
        }
        for(var i = 0, n = list1.childCount(); i < n; i++) {
            if(!Syntax.nodeOrTokenStructuralEquals(list1.childAt(i), list2.childAt(i))) {
                return false;
            }
        }
        return true;
    }
    Syntax.listStructuralEquals = listStructuralEquals;
    function separatedListStructuralEquals(list1, list2) {
        if(list1.childCount() !== list2.childCount()) {
            return false;
        }
        for(var i = 0, n = list1.childCount(); i < n; i++) {
            var element1 = list1.childAt(i);
            var element2 = list2.childAt(i);
            if(!Syntax.nodeOrTokenStructuralEquals(element1, element2)) {
                return false;
            }
        }
        return true;
    }
    Syntax.separatedListStructuralEquals = separatedListStructuralEquals;
    function elementStructuralEquals(element1, element2) {
        if(element1 === element2) {
            return true;
        }
        if(element1 === null || element2 === null) {
            return false;
        }
        if(element2.kind() !== element2.kind()) {
            return false;
        }
        if(element1.isToken()) {
            return tokenStructuralEquals(element1, element2);
        } else if(element1.isNode()) {
            return nodeStructuralEquals(element1, element2);
        } else if(element1.isList()) {
            return listStructuralEquals(element1, element2);
        } else if(element1.isSeparatedList()) {
            return separatedListStructuralEquals(element1, element2);
        }
        throw Errors.invalidOperation();
    }
    Syntax.elementStructuralEquals = elementStructuralEquals;
    function identifierName(text, info) {
        if (typeof info === "undefined") { info = null; }
        return Syntax.identifier(text);
    }
    Syntax.identifierName = identifierName;
    function trueExpression() {
        return Syntax.token(37 /* TrueKeyword */ );
    }
    Syntax.trueExpression = trueExpression;
    function falseExpression() {
        return Syntax.token(24 /* FalseKeyword */ );
    }
    Syntax.falseExpression = falseExpression;
    function numericLiteralExpression(text) {
        return Syntax.token(13 /* NumericLiteral */ , {
            text: text
        });
    }
    Syntax.numericLiteralExpression = numericLiteralExpression;
    function stringLiteralExpression(text) {
        return Syntax.token(14 /* StringLiteral */ , {
            text: text
        });
    }
    Syntax.stringLiteralExpression = stringLiteralExpression;
    function isSuperInvocationExpression(node) {
        return node.kind() === 210 /* InvocationExpression */  && (node).expression.kind() === 50 /* SuperKeyword */ ;
    }
    Syntax.isSuperInvocationExpression = isSuperInvocationExpression;
    function isSuperInvocationExpressionStatement(node) {
        return node.kind() === 146 /* ExpressionStatement */  && isSuperInvocationExpression((node).expression);
    }
    Syntax.isSuperInvocationExpressionStatement = isSuperInvocationExpressionStatement;
    function isSuperMemberAccessExpression(node) {
        return node.kind() === 209 /* MemberAccessExpression */  && (node).expression.kind() === 50 /* SuperKeyword */ ;
    }
    Syntax.isSuperMemberAccessExpression = isSuperMemberAccessExpression;
    function isSuperMemberAccessInvocationExpression(node) {
        return node.kind() === 210 /* InvocationExpression */  && isSuperMemberAccessExpression((node).expression);
    }
    Syntax.isSuperMemberAccessInvocationExpression = isSuperMemberAccessInvocationExpression;
    function assignmentExpression(left, token, right) {
        return Syntax.normalModeFactory.binaryExpression(171 /* AssignmentExpression */ , left, token, right);
    }
    Syntax.assignmentExpression = assignmentExpression;
})(Syntax || (Syntax = {}));
var SourceUnitSyntax = (function (_super) {
    __extends(SourceUnitSyntax, _super);
    function SourceUnitSyntax(moduleElements, endOfFileToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.moduleElements = moduleElements;
        this.endOfFileToken = endOfFileToken;
    }
    SourceUnitSyntax.prototype.accept = function (visitor) {
        return visitor.visitSourceUnit(this);
    };
    SourceUnitSyntax.prototype.kind = function () {
        return 120 /* SourceUnit */ ;
    };
    SourceUnitSyntax.prototype.childCount = function () {
        return 2;
    };
    SourceUnitSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.moduleElements;
            case 1:
                return this.endOfFileToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    SourceUnitSyntax.prototype.update = function (moduleElements, endOfFileToken) {
        if(this.moduleElements === moduleElements && this.endOfFileToken === endOfFileToken) {
            return this;
        }
        return new SourceUnitSyntax(moduleElements, endOfFileToken, this.parsedInStrictMode());
    };
    return SourceUnitSyntax;
})(SyntaxNode);
var ModuleReferenceSyntax = (function (_super) {
    __extends(ModuleReferenceSyntax, _super);
    function ModuleReferenceSyntax(parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
    }
    ModuleReferenceSyntax.prototype.isModuleReference = function () {
        return true;
    };
    return ModuleReferenceSyntax;
})(SyntaxNode);
var ExternalModuleReferenceSyntax = (function (_super) {
    __extends(ExternalModuleReferenceSyntax, _super);
    function ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.moduleKeyword = moduleKeyword;
        this.openParenToken = openParenToken;
        this.stringLiteral = stringLiteral;
        this.closeParenToken = closeParenToken;
    }
    ExternalModuleReferenceSyntax.prototype.accept = function (visitor) {
        return visitor.visitExternalModuleReference(this);
    };
    ExternalModuleReferenceSyntax.prototype.kind = function () {
        return 240 /* ExternalModuleReference */ ;
    };
    ExternalModuleReferenceSyntax.prototype.childCount = function () {
        return 4;
    };
    ExternalModuleReferenceSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.moduleKeyword;
            case 1:
                return this.openParenToken;
            case 2:
                return this.stringLiteral;
            case 3:
                return this.closeParenToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ExternalModuleReferenceSyntax.prototype.update = function (moduleKeyword, openParenToken, stringLiteral, closeParenToken) {
        if(this.moduleKeyword === moduleKeyword && this.openParenToken === openParenToken && this.stringLiteral === stringLiteral && this.closeParenToken === closeParenToken) {
            return this;
        }
        return new ExternalModuleReferenceSyntax(moduleKeyword, openParenToken, stringLiteral, closeParenToken, this.parsedInStrictMode());
    };
    return ExternalModuleReferenceSyntax;
})(ModuleReferenceSyntax);
var ModuleNameModuleReferenceSyntax = (function (_super) {
    __extends(ModuleNameModuleReferenceSyntax, _super);
    function ModuleNameModuleReferenceSyntax(moduleName, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.moduleName = moduleName;
    }
    ModuleNameModuleReferenceSyntax.prototype.accept = function (visitor) {
        return visitor.visitModuleNameModuleReference(this);
    };
    ModuleNameModuleReferenceSyntax.prototype.kind = function () {
        return 241 /* ModuleNameModuleReference */ ;
    };
    ModuleNameModuleReferenceSyntax.prototype.childCount = function () {
        return 1;
    };
    ModuleNameModuleReferenceSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.moduleName;
            default:
                throw Errors.invalidOperation();
        }
    };
    ModuleNameModuleReferenceSyntax.prototype.update = function (moduleName) {
        if(this.moduleName === moduleName) {
            return this;
        }
        return new ModuleNameModuleReferenceSyntax(moduleName, this.parsedInStrictMode());
    };
    return ModuleNameModuleReferenceSyntax;
})(ModuleReferenceSyntax);
var ImportDeclarationSyntax = (function (_super) {
    __extends(ImportDeclarationSyntax, _super);
    function ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.importKeyword = importKeyword;
        this.identifier = identifier;
        this.equalsToken = equalsToken;
        this.moduleReference = moduleReference;
        this.semicolonToken = semicolonToken;
    }
    ImportDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitImportDeclaration(this);
    };
    ImportDeclarationSyntax.prototype.kind = function () {
        return 132 /* ImportDeclaration */ ;
    };
    ImportDeclarationSyntax.prototype.childCount = function () {
        return 5;
    };
    ImportDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.importKeyword;
            case 1:
                return this.identifier;
            case 2:
                return this.equalsToken;
            case 3:
                return this.moduleReference;
            case 4:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ImportDeclarationSyntax.prototype.isModuleElement = function () {
        return true;
    };
    ImportDeclarationSyntax.prototype.update = function (importKeyword, identifier, equalsToken, moduleReference, semicolonToken) {
        if(this.importKeyword === importKeyword && this.identifier === identifier && this.equalsToken === equalsToken && this.moduleReference === moduleReference && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new ImportDeclarationSyntax(importKeyword, identifier, equalsToken, moduleReference, semicolonToken, this.parsedInStrictMode());
    };
    return ImportDeclarationSyntax;
})(SyntaxNode);
var ClassDeclarationSyntax = (function (_super) {
    __extends(ClassDeclarationSyntax, _super);
    function ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.exportKeyword = exportKeyword;
        this.declareKeyword = declareKeyword;
        this.classKeyword = classKeyword;
        this.identifier = identifier;
        this.typeParameterList = typeParameterList;
        this.extendsClause = extendsClause;
        this.implementsClause = implementsClause;
        this.openBraceToken = openBraceToken;
        this.classElements = classElements;
        this.closeBraceToken = closeBraceToken;
    }
    ClassDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitClassDeclaration(this);
    };
    ClassDeclarationSyntax.prototype.kind = function () {
        return 130 /* ClassDeclaration */ ;
    };
    ClassDeclarationSyntax.prototype.childCount = function () {
        return 10;
    };
    ClassDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.exportKeyword;
            case 1:
                return this.declareKeyword;
            case 2:
                return this.classKeyword;
            case 3:
                return this.identifier;
            case 4:
                return this.typeParameterList;
            case 5:
                return this.extendsClause;
            case 6:
                return this.implementsClause;
            case 7:
                return this.openBraceToken;
            case 8:
                return this.classElements;
            case 9:
                return this.closeBraceToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ClassDeclarationSyntax.prototype.isModuleElement = function () {
        return true;
    };
    ClassDeclarationSyntax.prototype.update = function (exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken) {
        if(this.exportKeyword === exportKeyword && this.declareKeyword === declareKeyword && this.classKeyword === classKeyword && this.identifier === identifier && this.typeParameterList === typeParameterList && this.extendsClause === extendsClause && this.implementsClause === implementsClause && this.openBraceToken === openBraceToken && this.classElements === classElements && this.closeBraceToken === closeBraceToken) {
            return this;
        }
        return new ClassDeclarationSyntax(exportKeyword, declareKeyword, classKeyword, identifier, typeParameterList, extendsClause, implementsClause, openBraceToken, classElements, closeBraceToken, this.parsedInStrictMode());
    };
    return ClassDeclarationSyntax;
})(SyntaxNode);
var InterfaceDeclarationSyntax = (function (_super) {
    __extends(InterfaceDeclarationSyntax, _super);
    function InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.exportKeyword = exportKeyword;
        this.interfaceKeyword = interfaceKeyword;
        this.identifier = identifier;
        this.typeParameterList = typeParameterList;
        this.extendsClause = extendsClause;
        this.body = body;
    }
    InterfaceDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitInterfaceDeclaration(this);
    };
    InterfaceDeclarationSyntax.prototype.kind = function () {
        return 127 /* InterfaceDeclaration */ ;
    };
    InterfaceDeclarationSyntax.prototype.childCount = function () {
        return 6;
    };
    InterfaceDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.exportKeyword;
            case 1:
                return this.interfaceKeyword;
            case 2:
                return this.identifier;
            case 3:
                return this.typeParameterList;
            case 4:
                return this.extendsClause;
            case 5:
                return this.body;
            default:
                throw Errors.invalidOperation();
        }
    };
    InterfaceDeclarationSyntax.prototype.isModuleElement = function () {
        return true;
    };
    InterfaceDeclarationSyntax.prototype.update = function (exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body) {
        if(this.exportKeyword === exportKeyword && this.interfaceKeyword === interfaceKeyword && this.identifier === identifier && this.typeParameterList === typeParameterList && this.extendsClause === extendsClause && this.body === body) {
            return this;
        }
        return new InterfaceDeclarationSyntax(exportKeyword, interfaceKeyword, identifier, typeParameterList, extendsClause, body, this.parsedInStrictMode());
    };
    return InterfaceDeclarationSyntax;
})(SyntaxNode);
var ExtendsClauseSyntax = (function (_super) {
    __extends(ExtendsClauseSyntax, _super);
    function ExtendsClauseSyntax(extendsKeyword, typeNames, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.extendsKeyword = extendsKeyword;
        this.typeNames = typeNames;
    }
    ExtendsClauseSyntax.prototype.accept = function (visitor) {
        return visitor.visitExtendsClause(this);
    };
    ExtendsClauseSyntax.prototype.kind = function () {
        return 228 /* ExtendsClause */ ;
    };
    ExtendsClauseSyntax.prototype.childCount = function () {
        return 2;
    };
    ExtendsClauseSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.extendsKeyword;
            case 1:
                return this.typeNames;
            default:
                throw Errors.invalidOperation();
        }
    };
    ExtendsClauseSyntax.prototype.update = function (extendsKeyword, typeNames) {
        if(this.extendsKeyword === extendsKeyword && this.typeNames === typeNames) {
            return this;
        }
        return new ExtendsClauseSyntax(extendsKeyword, typeNames, this.parsedInStrictMode());
    };
    return ExtendsClauseSyntax;
})(SyntaxNode);
var ImplementsClauseSyntax = (function (_super) {
    __extends(ImplementsClauseSyntax, _super);
    function ImplementsClauseSyntax(implementsKeyword, typeNames, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.implementsKeyword = implementsKeyword;
        this.typeNames = typeNames;
    }
    ImplementsClauseSyntax.prototype.accept = function (visitor) {
        return visitor.visitImplementsClause(this);
    };
    ImplementsClauseSyntax.prototype.kind = function () {
        return 227 /* ImplementsClause */ ;
    };
    ImplementsClauseSyntax.prototype.childCount = function () {
        return 2;
    };
    ImplementsClauseSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.implementsKeyword;
            case 1:
                return this.typeNames;
            default:
                throw Errors.invalidOperation();
        }
    };
    ImplementsClauseSyntax.prototype.update = function (implementsKeyword, typeNames) {
        if(this.implementsKeyword === implementsKeyword && this.typeNames === typeNames) {
            return this;
        }
        return new ImplementsClauseSyntax(implementsKeyword, typeNames, this.parsedInStrictMode());
    };
    return ImplementsClauseSyntax;
})(SyntaxNode);
var ModuleDeclarationSyntax = (function (_super) {
    __extends(ModuleDeclarationSyntax, _super);
    function ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.exportKeyword = exportKeyword;
        this.declareKeyword = declareKeyword;
        this.moduleKeyword = moduleKeyword;
        this.moduleName = moduleName;
        this.stringLiteral = stringLiteral;
        this.openBraceToken = openBraceToken;
        this.moduleElements = moduleElements;
        this.closeBraceToken = closeBraceToken;
    }
    ModuleDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitModuleDeclaration(this);
    };
    ModuleDeclarationSyntax.prototype.kind = function () {
        return 129 /* ModuleDeclaration */ ;
    };
    ModuleDeclarationSyntax.prototype.childCount = function () {
        return 8;
    };
    ModuleDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.exportKeyword;
            case 1:
                return this.declareKeyword;
            case 2:
                return this.moduleKeyword;
            case 3:
                return this.moduleName;
            case 4:
                return this.stringLiteral;
            case 5:
                return this.openBraceToken;
            case 6:
                return this.moduleElements;
            case 7:
                return this.closeBraceToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ModuleDeclarationSyntax.prototype.isModuleElement = function () {
        return true;
    };
    ModuleDeclarationSyntax.prototype.update = function (exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken) {
        if(this.exportKeyword === exportKeyword && this.declareKeyword === declareKeyword && this.moduleKeyword === moduleKeyword && this.moduleName === moduleName && this.stringLiteral === stringLiteral && this.openBraceToken === openBraceToken && this.moduleElements === moduleElements && this.closeBraceToken === closeBraceToken) {
            return this;
        }
        return new ModuleDeclarationSyntax(exportKeyword, declareKeyword, moduleKeyword, moduleName, stringLiteral, openBraceToken, moduleElements, closeBraceToken, this.parsedInStrictMode());
    };
    return ModuleDeclarationSyntax;
})(SyntaxNode);
var FunctionDeclarationSyntax = (function (_super) {
    __extends(FunctionDeclarationSyntax, _super);
    function FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.exportKeyword = exportKeyword;
        this.declareKeyword = declareKeyword;
        this.functionKeyword = functionKeyword;
        this.functionSignature = functionSignature;
        this.block = block;
        this.semicolonToken = semicolonToken;
    }
    FunctionDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitFunctionDeclaration(this);
    };
    FunctionDeclarationSyntax.prototype.kind = function () {
        return 128 /* FunctionDeclaration */ ;
    };
    FunctionDeclarationSyntax.prototype.childCount = function () {
        return 6;
    };
    FunctionDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.exportKeyword;
            case 1:
                return this.declareKeyword;
            case 2:
                return this.functionKeyword;
            case 3:
                return this.functionSignature;
            case 4:
                return this.block;
            case 5:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    FunctionDeclarationSyntax.prototype.isStatement = function () {
        return true;
    };
    FunctionDeclarationSyntax.prototype.isModuleElement = function () {
        return true;
    };
    FunctionDeclarationSyntax.prototype.update = function (exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken) {
        if(this.exportKeyword === exportKeyword && this.declareKeyword === declareKeyword && this.functionKeyword === functionKeyword && this.functionSignature === functionSignature && this.block === block && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new FunctionDeclarationSyntax(exportKeyword, declareKeyword, functionKeyword, functionSignature, block, semicolonToken, this.parsedInStrictMode());
    };
    return FunctionDeclarationSyntax;
})(SyntaxNode);
var VariableStatementSyntax = (function (_super) {
    __extends(VariableStatementSyntax, _super);
    function VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.exportKeyword = exportKeyword;
        this.declareKeyword = declareKeyword;
        this.variableDeclaration = variableDeclaration;
        this.semicolonToken = semicolonToken;
    }
    VariableStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitVariableStatement(this);
    };
    VariableStatementSyntax.prototype.kind = function () {
        return 145 /* VariableStatement */ ;
    };
    VariableStatementSyntax.prototype.childCount = function () {
        return 4;
    };
    VariableStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.exportKeyword;
            case 1:
                return this.declareKeyword;
            case 2:
                return this.variableDeclaration;
            case 3:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    VariableStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    VariableStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    VariableStatementSyntax.prototype.update = function (exportKeyword, declareKeyword, variableDeclaration, semicolonToken) {
        if(this.exportKeyword === exportKeyword && this.declareKeyword === declareKeyword && this.variableDeclaration === variableDeclaration && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new VariableStatementSyntax(exportKeyword, declareKeyword, variableDeclaration, semicolonToken, this.parsedInStrictMode());
    };
    return VariableStatementSyntax;
})(SyntaxNode);
var VariableDeclarationSyntax = (function (_super) {
    __extends(VariableDeclarationSyntax, _super);
    function VariableDeclarationSyntax(varKeyword, variableDeclarators, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.varKeyword = varKeyword;
        this.variableDeclarators = variableDeclarators;
    }
    VariableDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitVariableDeclaration(this);
    };
    VariableDeclarationSyntax.prototype.kind = function () {
        return 221 /* VariableDeclaration */ ;
    };
    VariableDeclarationSyntax.prototype.childCount = function () {
        return 2;
    };
    VariableDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.varKeyword;
            case 1:
                return this.variableDeclarators;
            default:
                throw Errors.invalidOperation();
        }
    };
    VariableDeclarationSyntax.prototype.update = function (varKeyword, variableDeclarators) {
        if(this.varKeyword === varKeyword && this.variableDeclarators === variableDeclarators) {
            return this;
        }
        return new VariableDeclarationSyntax(varKeyword, variableDeclarators, this.parsedInStrictMode());
    };
    return VariableDeclarationSyntax;
})(SyntaxNode);
var VariableDeclaratorSyntax = (function (_super) {
    __extends(VariableDeclaratorSyntax, _super);
    function VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.identifier = identifier;
        this.typeAnnotation = typeAnnotation;
        this.equalsValueClause = equalsValueClause;
    }
    VariableDeclaratorSyntax.prototype.accept = function (visitor) {
        return visitor.visitVariableDeclarator(this);
    };
    VariableDeclaratorSyntax.prototype.kind = function () {
        return 222 /* VariableDeclarator */ ;
    };
    VariableDeclaratorSyntax.prototype.childCount = function () {
        return 3;
    };
    VariableDeclaratorSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.identifier;
            case 1:
                return this.typeAnnotation;
            case 2:
                return this.equalsValueClause;
            default:
                throw Errors.invalidOperation();
        }
    };
    VariableDeclaratorSyntax.prototype.update = function (identifier, typeAnnotation, equalsValueClause) {
        if(this.identifier === identifier && this.typeAnnotation === typeAnnotation && this.equalsValueClause === equalsValueClause) {
            return this;
        }
        return new VariableDeclaratorSyntax(identifier, typeAnnotation, equalsValueClause, this.parsedInStrictMode());
    };
    return VariableDeclaratorSyntax;
})(SyntaxNode);
var EqualsValueClauseSyntax = (function (_super) {
    __extends(EqualsValueClauseSyntax, _super);
    function EqualsValueClauseSyntax(equalsToken, value, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.equalsToken = equalsToken;
        this.value = value;
    }
    EqualsValueClauseSyntax.prototype.accept = function (visitor) {
        return visitor.visitEqualsValueClause(this);
    };
    EqualsValueClauseSyntax.prototype.kind = function () {
        return 229 /* EqualsValueClause */ ;
    };
    EqualsValueClauseSyntax.prototype.childCount = function () {
        return 2;
    };
    EqualsValueClauseSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.equalsToken;
            case 1:
                return this.value;
            default:
                throw Errors.invalidOperation();
        }
    };
    EqualsValueClauseSyntax.prototype.update = function (equalsToken, value) {
        if(this.equalsToken === equalsToken && this.value === value) {
            return this;
        }
        return new EqualsValueClauseSyntax(equalsToken, value, this.parsedInStrictMode());
    };
    return EqualsValueClauseSyntax;
})(SyntaxNode);
var PrefixUnaryExpressionSyntax = (function (_super) {
    __extends(PrefixUnaryExpressionSyntax, _super);
    function PrefixUnaryExpressionSyntax(kind, operatorToken, operand, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.operatorToken = operatorToken;
        this.operand = operand;
        this._kind = kind;
    }
    PrefixUnaryExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitPrefixUnaryExpression(this);
    };
    PrefixUnaryExpressionSyntax.prototype.childCount = function () {
        return 2;
    };
    PrefixUnaryExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.operatorToken;
            case 1:
                return this.operand;
            default:
                throw Errors.invalidOperation();
        }
    };
    PrefixUnaryExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    PrefixUnaryExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    PrefixUnaryExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    PrefixUnaryExpressionSyntax.prototype.update = function (kind, operatorToken, operand) {
        if(this._kind === kind && this.operatorToken === operatorToken && this.operand === operand) {
            return this;
        }
        return new PrefixUnaryExpressionSyntax(kind, operatorToken, operand, this.parsedInStrictMode());
    };
    return PrefixUnaryExpressionSyntax;
})(SyntaxNode);
var ArrayLiteralExpressionSyntax = (function (_super) {
    __extends(ArrayLiteralExpressionSyntax, _super);
    function ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.openBracketToken = openBracketToken;
        this.expressions = expressions;
        this.closeBracketToken = closeBracketToken;
    }
    ArrayLiteralExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitArrayLiteralExpression(this);
    };
    ArrayLiteralExpressionSyntax.prototype.kind = function () {
        return 211 /* ArrayLiteralExpression */ ;
    };
    ArrayLiteralExpressionSyntax.prototype.childCount = function () {
        return 3;
    };
    ArrayLiteralExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.openBracketToken;
            case 1:
                return this.expressions;
            case 2:
                return this.closeBracketToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ArrayLiteralExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ArrayLiteralExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    ArrayLiteralExpressionSyntax.prototype.update = function (openBracketToken, expressions, closeBracketToken) {
        if(this.openBracketToken === openBracketToken && this.expressions === expressions && this.closeBracketToken === closeBracketToken) {
            return this;
        }
        return new ArrayLiteralExpressionSyntax(openBracketToken, expressions, closeBracketToken, this.parsedInStrictMode());
    };
    return ArrayLiteralExpressionSyntax;
})(SyntaxNode);
var OmittedExpressionSyntax = (function (_super) {
    __extends(OmittedExpressionSyntax, _super);
    function OmittedExpressionSyntax(parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
    }
    OmittedExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitOmittedExpression(this);
    };
    OmittedExpressionSyntax.prototype.kind = function () {
        return 220 /* OmittedExpression */ ;
    };
    OmittedExpressionSyntax.prototype.childCount = function () {
        return 0;
    };
    OmittedExpressionSyntax.prototype.childAt = function (slot) {
        throw Errors.invalidOperation();
    };
    OmittedExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    OmittedExpressionSyntax.prototype.update = function () {
        return this;
    };
    return OmittedExpressionSyntax;
})(SyntaxNode);
var ParenthesizedExpressionSyntax = (function (_super) {
    __extends(ParenthesizedExpressionSyntax, _super);
    function ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.openParenToken = openParenToken;
        this.expression = expression;
        this.closeParenToken = closeParenToken;
    }
    ParenthesizedExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitParenthesizedExpression(this);
    };
    ParenthesizedExpressionSyntax.prototype.kind = function () {
        return 214 /* ParenthesizedExpression */ ;
    };
    ParenthesizedExpressionSyntax.prototype.childCount = function () {
        return 3;
    };
    ParenthesizedExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.openParenToken;
            case 1:
                return this.expression;
            case 2:
                return this.closeParenToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ParenthesizedExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ParenthesizedExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    ParenthesizedExpressionSyntax.prototype.update = function (openParenToken, expression, closeParenToken) {
        if(this.openParenToken === openParenToken && this.expression === expression && this.closeParenToken === closeParenToken) {
            return this;
        }
        return new ParenthesizedExpressionSyntax(openParenToken, expression, closeParenToken, this.parsedInStrictMode());
    };
    return ParenthesizedExpressionSyntax;
})(SyntaxNode);
var ArrowFunctionExpressionSyntax = (function (_super) {
    __extends(ArrowFunctionExpressionSyntax, _super);
    function ArrowFunctionExpressionSyntax(equalsGreaterThanToken, body, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.equalsGreaterThanToken = equalsGreaterThanToken;
        this.body = body;
    }
    ArrowFunctionExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ArrowFunctionExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    return ArrowFunctionExpressionSyntax;
})(SyntaxNode);
var SimpleArrowFunctionExpressionSyntax = (function (_super) {
    __extends(SimpleArrowFunctionExpressionSyntax, _super);
    function SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, parsedInStrictMode) {
        _super.call(this, equalsGreaterThanToken, body, parsedInStrictMode);
        this.identifier = identifier;
    }
    SimpleArrowFunctionExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitSimpleArrowFunctionExpression(this);
    };
    SimpleArrowFunctionExpressionSyntax.prototype.kind = function () {
        return 216 /* SimpleArrowFunctionExpression */ ;
    };
    SimpleArrowFunctionExpressionSyntax.prototype.childCount = function () {
        return 3;
    };
    SimpleArrowFunctionExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.identifier;
            case 1:
                return this.equalsGreaterThanToken;
            case 2:
                return this.body;
            default:
                throw Errors.invalidOperation();
        }
    };
    SimpleArrowFunctionExpressionSyntax.prototype.update = function (identifier, equalsGreaterThanToken, body) {
        if(this.identifier === identifier && this.equalsGreaterThanToken === equalsGreaterThanToken && this.body === body) {
            return this;
        }
        return new SimpleArrowFunctionExpressionSyntax(identifier, equalsGreaterThanToken, body, this.parsedInStrictMode());
    };
    return SimpleArrowFunctionExpressionSyntax;
})(ArrowFunctionExpressionSyntax);
var ParenthesizedArrowFunctionExpressionSyntax = (function (_super) {
    __extends(ParenthesizedArrowFunctionExpressionSyntax, _super);
    function ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, parsedInStrictMode) {
        _super.call(this, equalsGreaterThanToken, body, parsedInStrictMode);
        this.callSignature = callSignature;
    }
    ParenthesizedArrowFunctionExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitParenthesizedArrowFunctionExpression(this);
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.kind = function () {
        return 215 /* ParenthesizedArrowFunctionExpression */ ;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.childCount = function () {
        return 3;
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.callSignature;
            case 1:
                return this.equalsGreaterThanToken;
            case 2:
                return this.body;
            default:
                throw Errors.invalidOperation();
        }
    };
    ParenthesizedArrowFunctionExpressionSyntax.prototype.update = function (callSignature, equalsGreaterThanToken, body) {
        if(this.callSignature === callSignature && this.equalsGreaterThanToken === equalsGreaterThanToken && this.body === body) {
            return this;
        }
        return new ParenthesizedArrowFunctionExpressionSyntax(callSignature, equalsGreaterThanToken, body, this.parsedInStrictMode());
    };
    return ParenthesizedArrowFunctionExpressionSyntax;
})(ArrowFunctionExpressionSyntax);
var QualifiedNameSyntax = (function (_super) {
    __extends(QualifiedNameSyntax, _super);
    function QualifiedNameSyntax(left, dotToken, right, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.left = left;
        this.dotToken = dotToken;
        this.right = right;
    }
    QualifiedNameSyntax.prototype.accept = function (visitor) {
        return visitor.visitQualifiedName(this);
    };
    QualifiedNameSyntax.prototype.kind = function () {
        return 121 /* QualifiedName */ ;
    };
    QualifiedNameSyntax.prototype.childCount = function () {
        return 3;
    };
    QualifiedNameSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.left;
            case 1:
                return this.dotToken;
            case 2:
                return this.right;
            default:
                throw Errors.invalidOperation();
        }
    };
    QualifiedNameSyntax.prototype.isName = function () {
        return true;
    };
    QualifiedNameSyntax.prototype.isType = function () {
        return true;
    };
    QualifiedNameSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    QualifiedNameSyntax.prototype.isExpression = function () {
        return true;
    };
    QualifiedNameSyntax.prototype.update = function (left, dotToken, right) {
        if(this.left === left && this.dotToken === dotToken && this.right === right) {
            return this;
        }
        return new QualifiedNameSyntax(left, dotToken, right, this.parsedInStrictMode());
    };
    return QualifiedNameSyntax;
})(SyntaxNode);
var TypeArgumentListSyntax = (function (_super) {
    __extends(TypeArgumentListSyntax, _super);
    function TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.lessThanToken = lessThanToken;
        this.typeArguments = typeArguments;
        this.greaterThanToken = greaterThanToken;
    }
    TypeArgumentListSyntax.prototype.accept = function (visitor) {
        return visitor.visitTypeArgumentList(this);
    };
    TypeArgumentListSyntax.prototype.kind = function () {
        return 225 /* TypeArgumentList */ ;
    };
    TypeArgumentListSyntax.prototype.childCount = function () {
        return 3;
    };
    TypeArgumentListSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.lessThanToken;
            case 1:
                return this.typeArguments;
            case 2:
                return this.greaterThanToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    TypeArgumentListSyntax.prototype.update = function (lessThanToken, typeArguments, greaterThanToken) {
        if(this.lessThanToken === lessThanToken && this.typeArguments === typeArguments && this.greaterThanToken === greaterThanToken) {
            return this;
        }
        return new TypeArgumentListSyntax(lessThanToken, typeArguments, greaterThanToken, this.parsedInStrictMode());
    };
    return TypeArgumentListSyntax;
})(SyntaxNode);
var ConstructorTypeSyntax = (function (_super) {
    __extends(ConstructorTypeSyntax, _super);
    function ConstructorTypeSyntax(newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.newKeyword = newKeyword;
        this.typeParameterList = typeParameterList;
        this.parameterList = parameterList;
        this.equalsGreaterThanToken = equalsGreaterThanToken;
        this.type = type;
    }
    ConstructorTypeSyntax.prototype.accept = function (visitor) {
        return visitor.visitConstructorType(this);
    };
    ConstructorTypeSyntax.prototype.kind = function () {
        return 125 /* ConstructorType */ ;
    };
    ConstructorTypeSyntax.prototype.childCount = function () {
        return 5;
    };
    ConstructorTypeSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.newKeyword;
            case 1:
                return this.typeParameterList;
            case 2:
                return this.parameterList;
            case 3:
                return this.equalsGreaterThanToken;
            case 4:
                return this.type;
            default:
                throw Errors.invalidOperation();
        }
    };
    ConstructorTypeSyntax.prototype.isType = function () {
        return true;
    };
    ConstructorTypeSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ConstructorTypeSyntax.prototype.isExpression = function () {
        return true;
    };
    ConstructorTypeSyntax.prototype.update = function (newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type) {
        if(this.newKeyword === newKeyword && this.typeParameterList === typeParameterList && this.parameterList === parameterList && this.equalsGreaterThanToken === equalsGreaterThanToken && this.type === type) {
            return this;
        }
        return new ConstructorTypeSyntax(newKeyword, typeParameterList, parameterList, equalsGreaterThanToken, type, this.parsedInStrictMode());
    };
    return ConstructorTypeSyntax;
})(SyntaxNode);
var FunctionTypeSyntax = (function (_super) {
    __extends(FunctionTypeSyntax, _super);
    function FunctionTypeSyntax(typeParameterList, parameterList, equalsGreaterThanToken, type, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.typeParameterList = typeParameterList;
        this.parameterList = parameterList;
        this.equalsGreaterThanToken = equalsGreaterThanToken;
        this.type = type;
    }
    FunctionTypeSyntax.prototype.accept = function (visitor) {
        return visitor.visitFunctionType(this);
    };
    FunctionTypeSyntax.prototype.kind = function () {
        return 123 /* FunctionType */ ;
    };
    FunctionTypeSyntax.prototype.childCount = function () {
        return 4;
    };
    FunctionTypeSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.typeParameterList;
            case 1:
                return this.parameterList;
            case 2:
                return this.equalsGreaterThanToken;
            case 3:
                return this.type;
            default:
                throw Errors.invalidOperation();
        }
    };
    FunctionTypeSyntax.prototype.isType = function () {
        return true;
    };
    FunctionTypeSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    FunctionTypeSyntax.prototype.isExpression = function () {
        return true;
    };
    FunctionTypeSyntax.prototype.update = function (typeParameterList, parameterList, equalsGreaterThanToken, type) {
        if(this.typeParameterList === typeParameterList && this.parameterList === parameterList && this.equalsGreaterThanToken === equalsGreaterThanToken && this.type === type) {
            return this;
        }
        return new FunctionTypeSyntax(typeParameterList, parameterList, equalsGreaterThanToken, type, this.parsedInStrictMode());
    };
    return FunctionTypeSyntax;
})(SyntaxNode);
var ObjectTypeSyntax = (function (_super) {
    __extends(ObjectTypeSyntax, _super);
    function ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.openBraceToken = openBraceToken;
        this.typeMembers = typeMembers;
        this.closeBraceToken = closeBraceToken;
    }
    ObjectTypeSyntax.prototype.accept = function (visitor) {
        return visitor.visitObjectType(this);
    };
    ObjectTypeSyntax.prototype.kind = function () {
        return 122 /* ObjectType */ ;
    };
    ObjectTypeSyntax.prototype.childCount = function () {
        return 3;
    };
    ObjectTypeSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.openBraceToken;
            case 1:
                return this.typeMembers;
            case 2:
                return this.closeBraceToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ObjectTypeSyntax.prototype.isType = function () {
        return true;
    };
    ObjectTypeSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ObjectTypeSyntax.prototype.isExpression = function () {
        return true;
    };
    ObjectTypeSyntax.prototype.update = function (openBraceToken, typeMembers, closeBraceToken) {
        if(this.openBraceToken === openBraceToken && this.typeMembers === typeMembers && this.closeBraceToken === closeBraceToken) {
            return this;
        }
        return new ObjectTypeSyntax(openBraceToken, typeMembers, closeBraceToken, this.parsedInStrictMode());
    };
    return ObjectTypeSyntax;
})(SyntaxNode);
var ArrayTypeSyntax = (function (_super) {
    __extends(ArrayTypeSyntax, _super);
    function ArrayTypeSyntax(type, openBracketToken, closeBracketToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.type = type;
        this.openBracketToken = openBracketToken;
        this.closeBracketToken = closeBracketToken;
    }
    ArrayTypeSyntax.prototype.accept = function (visitor) {
        return visitor.visitArrayType(this);
    };
    ArrayTypeSyntax.prototype.kind = function () {
        return 124 /* ArrayType */ ;
    };
    ArrayTypeSyntax.prototype.childCount = function () {
        return 3;
    };
    ArrayTypeSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.type;
            case 1:
                return this.openBracketToken;
            case 2:
                return this.closeBracketToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ArrayTypeSyntax.prototype.isType = function () {
        return true;
    };
    ArrayTypeSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ArrayTypeSyntax.prototype.isExpression = function () {
        return true;
    };
    ArrayTypeSyntax.prototype.update = function (type, openBracketToken, closeBracketToken) {
        if(this.type === type && this.openBracketToken === openBracketToken && this.closeBracketToken === closeBracketToken) {
            return this;
        }
        return new ArrayTypeSyntax(type, openBracketToken, closeBracketToken, this.parsedInStrictMode());
    };
    return ArrayTypeSyntax;
})(SyntaxNode);
var GenericTypeSyntax = (function (_super) {
    __extends(GenericTypeSyntax, _super);
    function GenericTypeSyntax(name, typeArgumentList, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.name = name;
        this.typeArgumentList = typeArgumentList;
    }
    GenericTypeSyntax.prototype.accept = function (visitor) {
        return visitor.visitGenericType(this);
    };
    GenericTypeSyntax.prototype.kind = function () {
        return 126 /* GenericType */ ;
    };
    GenericTypeSyntax.prototype.childCount = function () {
        return 2;
    };
    GenericTypeSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.name;
            case 1:
                return this.typeArgumentList;
            default:
                throw Errors.invalidOperation();
        }
    };
    GenericTypeSyntax.prototype.isType = function () {
        return true;
    };
    GenericTypeSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    GenericTypeSyntax.prototype.isExpression = function () {
        return true;
    };
    GenericTypeSyntax.prototype.update = function (name, typeArgumentList) {
        if(this.name === name && this.typeArgumentList === typeArgumentList) {
            return this;
        }
        return new GenericTypeSyntax(name, typeArgumentList, this.parsedInStrictMode());
    };
    return GenericTypeSyntax;
})(SyntaxNode);
var TypeAnnotationSyntax = (function (_super) {
    __extends(TypeAnnotationSyntax, _super);
    function TypeAnnotationSyntax(colonToken, type, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.colonToken = colonToken;
        this.type = type;
    }
    TypeAnnotationSyntax.prototype.accept = function (visitor) {
        return visitor.visitTypeAnnotation(this);
    };
    TypeAnnotationSyntax.prototype.kind = function () {
        return 238 /* TypeAnnotation */ ;
    };
    TypeAnnotationSyntax.prototype.childCount = function () {
        return 2;
    };
    TypeAnnotationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.colonToken;
            case 1:
                return this.type;
            default:
                throw Errors.invalidOperation();
        }
    };
    TypeAnnotationSyntax.prototype.update = function (colonToken, type) {
        if(this.colonToken === colonToken && this.type === type) {
            return this;
        }
        return new TypeAnnotationSyntax(colonToken, type, this.parsedInStrictMode());
    };
    return TypeAnnotationSyntax;
})(SyntaxNode);
var BlockSyntax = (function (_super) {
    __extends(BlockSyntax, _super);
    function BlockSyntax(openBraceToken, statements, closeBraceToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.openBraceToken = openBraceToken;
        this.statements = statements;
        this.closeBraceToken = closeBraceToken;
    }
    BlockSyntax.prototype.accept = function (visitor) {
        return visitor.visitBlock(this);
    };
    BlockSyntax.prototype.kind = function () {
        return 143 /* Block */ ;
    };
    BlockSyntax.prototype.childCount = function () {
        return 3;
    };
    BlockSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.openBraceToken;
            case 1:
                return this.statements;
            case 2:
                return this.closeBraceToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    BlockSyntax.prototype.isStatement = function () {
        return true;
    };
    BlockSyntax.prototype.isModuleElement = function () {
        return true;
    };
    BlockSyntax.prototype.update = function (openBraceToken, statements, closeBraceToken) {
        if(this.openBraceToken === openBraceToken && this.statements === statements && this.closeBraceToken === closeBraceToken) {
            return this;
        }
        return new BlockSyntax(openBraceToken, statements, closeBraceToken, this.parsedInStrictMode());
    };
    return BlockSyntax;
})(SyntaxNode);
var ParameterSyntax = (function (_super) {
    __extends(ParameterSyntax, _super);
    function ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.dotDotDotToken = dotDotDotToken;
        this.publicOrPrivateKeyword = publicOrPrivateKeyword;
        this.identifier = identifier;
        this.questionToken = questionToken;
        this.typeAnnotation = typeAnnotation;
        this.equalsValueClause = equalsValueClause;
    }
    ParameterSyntax.prototype.accept = function (visitor) {
        return visitor.visitParameter(this);
    };
    ParameterSyntax.prototype.kind = function () {
        return 237 /* Parameter */ ;
    };
    ParameterSyntax.prototype.childCount = function () {
        return 6;
    };
    ParameterSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.dotDotDotToken;
            case 1:
                return this.publicOrPrivateKeyword;
            case 2:
                return this.identifier;
            case 3:
                return this.questionToken;
            case 4:
                return this.typeAnnotation;
            case 5:
                return this.equalsValueClause;
            default:
                throw Errors.invalidOperation();
        }
    };
    ParameterSyntax.prototype.update = function (dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause) {
        if(this.dotDotDotToken === dotDotDotToken && this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.identifier === identifier && this.questionToken === questionToken && this.typeAnnotation === typeAnnotation && this.equalsValueClause === equalsValueClause) {
            return this;
        }
        return new ParameterSyntax(dotDotDotToken, publicOrPrivateKeyword, identifier, questionToken, typeAnnotation, equalsValueClause, this.parsedInStrictMode());
    };
    return ParameterSyntax;
})(SyntaxNode);
var MemberAccessExpressionSyntax = (function (_super) {
    __extends(MemberAccessExpressionSyntax, _super);
    function MemberAccessExpressionSyntax(expression, dotToken, name, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.expression = expression;
        this.dotToken = dotToken;
        this.name = name;
    }
    MemberAccessExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitMemberAccessExpression(this);
    };
    MemberAccessExpressionSyntax.prototype.kind = function () {
        return 209 /* MemberAccessExpression */ ;
    };
    MemberAccessExpressionSyntax.prototype.childCount = function () {
        return 3;
    };
    MemberAccessExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.expression;
            case 1:
                return this.dotToken;
            case 2:
                return this.name;
            default:
                throw Errors.invalidOperation();
        }
    };
    MemberAccessExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    MemberAccessExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    MemberAccessExpressionSyntax.prototype.update = function (expression, dotToken, name) {
        if(this.expression === expression && this.dotToken === dotToken && this.name === name) {
            return this;
        }
        return new MemberAccessExpressionSyntax(expression, dotToken, name, this.parsedInStrictMode());
    };
    return MemberAccessExpressionSyntax;
})(SyntaxNode);
var PostfixUnaryExpressionSyntax = (function (_super) {
    __extends(PostfixUnaryExpressionSyntax, _super);
    function PostfixUnaryExpressionSyntax(kind, operand, operatorToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.operand = operand;
        this.operatorToken = operatorToken;
        this._kind = kind;
    }
    PostfixUnaryExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitPostfixUnaryExpression(this);
    };
    PostfixUnaryExpressionSyntax.prototype.childCount = function () {
        return 2;
    };
    PostfixUnaryExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.operand;
            case 1:
                return this.operatorToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    PostfixUnaryExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    PostfixUnaryExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    PostfixUnaryExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    PostfixUnaryExpressionSyntax.prototype.update = function (kind, operand, operatorToken) {
        if(this._kind === kind && this.operand === operand && this.operatorToken === operatorToken) {
            return this;
        }
        return new PostfixUnaryExpressionSyntax(kind, operand, operatorToken, this.parsedInStrictMode());
    };
    return PostfixUnaryExpressionSyntax;
})(SyntaxNode);
var ElementAccessExpressionSyntax = (function (_super) {
    __extends(ElementAccessExpressionSyntax, _super);
    function ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.expression = expression;
        this.openBracketToken = openBracketToken;
        this.argumentExpression = argumentExpression;
        this.closeBracketToken = closeBracketToken;
    }
    ElementAccessExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitElementAccessExpression(this);
    };
    ElementAccessExpressionSyntax.prototype.kind = function () {
        return 218 /* ElementAccessExpression */ ;
    };
    ElementAccessExpressionSyntax.prototype.childCount = function () {
        return 4;
    };
    ElementAccessExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.expression;
            case 1:
                return this.openBracketToken;
            case 2:
                return this.argumentExpression;
            case 3:
                return this.closeBracketToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ElementAccessExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ElementAccessExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    ElementAccessExpressionSyntax.prototype.update = function (expression, openBracketToken, argumentExpression, closeBracketToken) {
        if(this.expression === expression && this.openBracketToken === openBracketToken && this.argumentExpression === argumentExpression && this.closeBracketToken === closeBracketToken) {
            return this;
        }
        return new ElementAccessExpressionSyntax(expression, openBracketToken, argumentExpression, closeBracketToken, this.parsedInStrictMode());
    };
    return ElementAccessExpressionSyntax;
})(SyntaxNode);
var InvocationExpressionSyntax = (function (_super) {
    __extends(InvocationExpressionSyntax, _super);
    function InvocationExpressionSyntax(expression, argumentList, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.expression = expression;
        this.argumentList = argumentList;
    }
    InvocationExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitInvocationExpression(this);
    };
    InvocationExpressionSyntax.prototype.kind = function () {
        return 210 /* InvocationExpression */ ;
    };
    InvocationExpressionSyntax.prototype.childCount = function () {
        return 2;
    };
    InvocationExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.expression;
            case 1:
                return this.argumentList;
            default:
                throw Errors.invalidOperation();
        }
    };
    InvocationExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    InvocationExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    InvocationExpressionSyntax.prototype.update = function (expression, argumentList) {
        if(this.expression === expression && this.argumentList === argumentList) {
            return this;
        }
        return new InvocationExpressionSyntax(expression, argumentList, this.parsedInStrictMode());
    };
    return InvocationExpressionSyntax;
})(SyntaxNode);
var ArgumentListSyntax = (function (_super) {
    __extends(ArgumentListSyntax, _super);
    function ArgumentListSyntax(typeArgumentList, openParenToken, _arguments, closeParenToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.typeArgumentList = typeArgumentList;
        this.openParenToken = openParenToken;
        this._arguments = _arguments;
        this.closeParenToken = closeParenToken;
    }
    ArgumentListSyntax.prototype.accept = function (visitor) {
        return visitor.visitArgumentList(this);
    };
    ArgumentListSyntax.prototype.kind = function () {
        return 223 /* ArgumentList */ ;
    };
    ArgumentListSyntax.prototype.childCount = function () {
        return 4;
    };
    ArgumentListSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.typeArgumentList;
            case 1:
                return this.openParenToken;
            case 2:
                return this.arguments;
            case 3:
                return this.closeParenToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ArgumentListSyntax.prototype.update = function (typeArgumentList, openParenToken, _arguments, closeParenToken) {
        if(this.typeArgumentList === typeArgumentList && this.openParenToken === openParenToken && this.arguments === _arguments && this.closeParenToken === closeParenToken) {
            return this;
        }
        return new ArgumentListSyntax(typeArgumentList, openParenToken, _arguments, closeParenToken, this.parsedInStrictMode());
    };
    return ArgumentListSyntax;
})(SyntaxNode);
var BinaryExpressionSyntax = (function (_super) {
    __extends(BinaryExpressionSyntax, _super);
    function BinaryExpressionSyntax(kind, left, operatorToken, right, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.left = left;
        this.operatorToken = operatorToken;
        this.right = right;
        this._kind = kind;
    }
    BinaryExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitBinaryExpression(this);
    };
    BinaryExpressionSyntax.prototype.childCount = function () {
        return 3;
    };
    BinaryExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.left;
            case 1:
                return this.operatorToken;
            case 2:
                return this.right;
            default:
                throw Errors.invalidOperation();
        }
    };
    BinaryExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    BinaryExpressionSyntax.prototype.kind = function () {
        return this._kind;
    };
    BinaryExpressionSyntax.prototype.update = function (kind, left, operatorToken, right) {
        if(this._kind === kind && this.left === left && this.operatorToken === operatorToken && this.right === right) {
            return this;
        }
        return new BinaryExpressionSyntax(kind, left, operatorToken, right, this.parsedInStrictMode());
    };
    return BinaryExpressionSyntax;
})(SyntaxNode);
var ConditionalExpressionSyntax = (function (_super) {
    __extends(ConditionalExpressionSyntax, _super);
    function ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.condition = condition;
        this.questionToken = questionToken;
        this.whenTrue = whenTrue;
        this.colonToken = colonToken;
        this.whenFalse = whenFalse;
    }
    ConditionalExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitConditionalExpression(this);
    };
    ConditionalExpressionSyntax.prototype.kind = function () {
        return 183 /* ConditionalExpression */ ;
    };
    ConditionalExpressionSyntax.prototype.childCount = function () {
        return 5;
    };
    ConditionalExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.condition;
            case 1:
                return this.questionToken;
            case 2:
                return this.whenTrue;
            case 3:
                return this.colonToken;
            case 4:
                return this.whenFalse;
            default:
                throw Errors.invalidOperation();
        }
    };
    ConditionalExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    ConditionalExpressionSyntax.prototype.update = function (condition, questionToken, whenTrue, colonToken, whenFalse) {
        if(this.condition === condition && this.questionToken === questionToken && this.whenTrue === whenTrue && this.colonToken === colonToken && this.whenFalse === whenFalse) {
            return this;
        }
        return new ConditionalExpressionSyntax(condition, questionToken, whenTrue, colonToken, whenFalse, this.parsedInStrictMode());
    };
    return ConditionalExpressionSyntax;
})(SyntaxNode);
var TypeMemberSyntax = (function (_super) {
    __extends(TypeMemberSyntax, _super);
    function TypeMemberSyntax(parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
    }
    TypeMemberSyntax.prototype.isTypeMember = function () {
        return true;
    };
    return TypeMemberSyntax;
})(SyntaxNode);
var ConstructSignatureSyntax = (function (_super) {
    __extends(ConstructSignatureSyntax, _super);
    function ConstructSignatureSyntax(newKeyword, callSignature, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.newKeyword = newKeyword;
        this.callSignature = callSignature;
    }
    ConstructSignatureSyntax.prototype.accept = function (visitor) {
        return visitor.visitConstructSignature(this);
    };
    ConstructSignatureSyntax.prototype.kind = function () {
        return 140 /* ConstructSignature */ ;
    };
    ConstructSignatureSyntax.prototype.childCount = function () {
        return 2;
    };
    ConstructSignatureSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.newKeyword;
            case 1:
                return this.callSignature;
            default:
                throw Errors.invalidOperation();
        }
    };
    ConstructSignatureSyntax.prototype.update = function (newKeyword, callSignature) {
        if(this.newKeyword === newKeyword && this.callSignature === callSignature) {
            return this;
        }
        return new ConstructSignatureSyntax(newKeyword, callSignature, this.parsedInStrictMode());
    };
    return ConstructSignatureSyntax;
})(TypeMemberSyntax);
var FunctionSignatureSyntax = (function (_super) {
    __extends(FunctionSignatureSyntax, _super);
    function FunctionSignatureSyntax(identifier, questionToken, callSignature, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.identifier = identifier;
        this.questionToken = questionToken;
        this.callSignature = callSignature;
    }
    FunctionSignatureSyntax.prototype.accept = function (visitor) {
        return visitor.visitFunctionSignature(this);
    };
    FunctionSignatureSyntax.prototype.kind = function () {
        return 142 /* FunctionSignature */ ;
    };
    FunctionSignatureSyntax.prototype.childCount = function () {
        return 3;
    };
    FunctionSignatureSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.identifier;
            case 1:
                return this.questionToken;
            case 2:
                return this.callSignature;
            default:
                throw Errors.invalidOperation();
        }
    };
    FunctionSignatureSyntax.prototype.update = function (identifier, questionToken, callSignature) {
        if(this.identifier === identifier && this.questionToken === questionToken && this.callSignature === callSignature) {
            return this;
        }
        return new FunctionSignatureSyntax(identifier, questionToken, callSignature, this.parsedInStrictMode());
    };
    return FunctionSignatureSyntax;
})(TypeMemberSyntax);
var IndexSignatureSyntax = (function (_super) {
    __extends(IndexSignatureSyntax, _super);
    function IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.openBracketToken = openBracketToken;
        this.parameter = parameter;
        this.closeBracketToken = closeBracketToken;
        this.typeAnnotation = typeAnnotation;
    }
    IndexSignatureSyntax.prototype.accept = function (visitor) {
        return visitor.visitIndexSignature(this);
    };
    IndexSignatureSyntax.prototype.kind = function () {
        return 141 /* IndexSignature */ ;
    };
    IndexSignatureSyntax.prototype.childCount = function () {
        return 4;
    };
    IndexSignatureSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.openBracketToken;
            case 1:
                return this.parameter;
            case 2:
                return this.closeBracketToken;
            case 3:
                return this.typeAnnotation;
            default:
                throw Errors.invalidOperation();
        }
    };
    IndexSignatureSyntax.prototype.update = function (openBracketToken, parameter, closeBracketToken, typeAnnotation) {
        if(this.openBracketToken === openBracketToken && this.parameter === parameter && this.closeBracketToken === closeBracketToken && this.typeAnnotation === typeAnnotation) {
            return this;
        }
        return new IndexSignatureSyntax(openBracketToken, parameter, closeBracketToken, typeAnnotation, this.parsedInStrictMode());
    };
    return IndexSignatureSyntax;
})(TypeMemberSyntax);
var PropertySignatureSyntax = (function (_super) {
    __extends(PropertySignatureSyntax, _super);
    function PropertySignatureSyntax(identifier, questionToken, typeAnnotation, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.identifier = identifier;
        this.questionToken = questionToken;
        this.typeAnnotation = typeAnnotation;
    }
    PropertySignatureSyntax.prototype.accept = function (visitor) {
        return visitor.visitPropertySignature(this);
    };
    PropertySignatureSyntax.prototype.kind = function () {
        return 138 /* PropertySignature */ ;
    };
    PropertySignatureSyntax.prototype.childCount = function () {
        return 3;
    };
    PropertySignatureSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.identifier;
            case 1:
                return this.questionToken;
            case 2:
                return this.typeAnnotation;
            default:
                throw Errors.invalidOperation();
        }
    };
    PropertySignatureSyntax.prototype.update = function (identifier, questionToken, typeAnnotation) {
        if(this.identifier === identifier && this.questionToken === questionToken && this.typeAnnotation === typeAnnotation) {
            return this;
        }
        return new PropertySignatureSyntax(identifier, questionToken, typeAnnotation, this.parsedInStrictMode());
    };
    return PropertySignatureSyntax;
})(TypeMemberSyntax);
var ParameterListSyntax = (function (_super) {
    __extends(ParameterListSyntax, _super);
    function ParameterListSyntax(openParenToken, parameters, closeParenToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.openParenToken = openParenToken;
        this.parameters = parameters;
        this.closeParenToken = closeParenToken;
    }
    ParameterListSyntax.prototype.accept = function (visitor) {
        return visitor.visitParameterList(this);
    };
    ParameterListSyntax.prototype.kind = function () {
        return 224 /* ParameterList */ ;
    };
    ParameterListSyntax.prototype.childCount = function () {
        return 3;
    };
    ParameterListSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.openParenToken;
            case 1:
                return this.parameters;
            case 2:
                return this.closeParenToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ParameterListSyntax.prototype.update = function (openParenToken, parameters, closeParenToken) {
        if(this.openParenToken === openParenToken && this.parameters === parameters && this.closeParenToken === closeParenToken) {
            return this;
        }
        return new ParameterListSyntax(openParenToken, parameters, closeParenToken, this.parsedInStrictMode());
    };
    return ParameterListSyntax;
})(SyntaxNode);
var CallSignatureSyntax = (function (_super) {
    __extends(CallSignatureSyntax, _super);
    function CallSignatureSyntax(typeParameterList, parameterList, typeAnnotation, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.typeParameterList = typeParameterList;
        this.parameterList = parameterList;
        this.typeAnnotation = typeAnnotation;
    }
    CallSignatureSyntax.prototype.accept = function (visitor) {
        return visitor.visitCallSignature(this);
    };
    CallSignatureSyntax.prototype.kind = function () {
        return 139 /* CallSignature */ ;
    };
    CallSignatureSyntax.prototype.childCount = function () {
        return 3;
    };
    CallSignatureSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.typeParameterList;
            case 1:
                return this.parameterList;
            case 2:
                return this.typeAnnotation;
            default:
                throw Errors.invalidOperation();
        }
    };
    CallSignatureSyntax.prototype.update = function (typeParameterList, parameterList, typeAnnotation) {
        if(this.typeParameterList === typeParameterList && this.parameterList === parameterList && this.typeAnnotation === typeAnnotation) {
            return this;
        }
        return new CallSignatureSyntax(typeParameterList, parameterList, typeAnnotation, this.parsedInStrictMode());
    };
    return CallSignatureSyntax;
})(TypeMemberSyntax);
var TypeParameterListSyntax = (function (_super) {
    __extends(TypeParameterListSyntax, _super);
    function TypeParameterListSyntax(lessThanToken, typeParameters, greaterThanToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.lessThanToken = lessThanToken;
        this.typeParameters = typeParameters;
        this.greaterThanToken = greaterThanToken;
    }
    TypeParameterListSyntax.prototype.accept = function (visitor) {
        return visitor.visitTypeParameterList(this);
    };
    TypeParameterListSyntax.prototype.kind = function () {
        return 226 /* TypeParameterList */ ;
    };
    TypeParameterListSyntax.prototype.childCount = function () {
        return 3;
    };
    TypeParameterListSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.lessThanToken;
            case 1:
                return this.typeParameters;
            case 2:
                return this.greaterThanToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    TypeParameterListSyntax.prototype.update = function (lessThanToken, typeParameters, greaterThanToken) {
        if(this.lessThanToken === lessThanToken && this.typeParameters === typeParameters && this.greaterThanToken === greaterThanToken) {
            return this;
        }
        return new TypeParameterListSyntax(lessThanToken, typeParameters, greaterThanToken, this.parsedInStrictMode());
    };
    return TypeParameterListSyntax;
})(SyntaxNode);
var TypeParameterSyntax = (function (_super) {
    __extends(TypeParameterSyntax, _super);
    function TypeParameterSyntax(identifier, constraint, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.identifier = identifier;
        this.constraint = constraint;
    }
    TypeParameterSyntax.prototype.accept = function (visitor) {
        return visitor.visitTypeParameter(this);
    };
    TypeParameterSyntax.prototype.kind = function () {
        return 235 /* TypeParameter */ ;
    };
    TypeParameterSyntax.prototype.childCount = function () {
        return 2;
    };
    TypeParameterSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.identifier;
            case 1:
                return this.constraint;
            default:
                throw Errors.invalidOperation();
        }
    };
    TypeParameterSyntax.prototype.update = function (identifier, constraint) {
        if(this.identifier === identifier && this.constraint === constraint) {
            return this;
        }
        return new TypeParameterSyntax(identifier, constraint, this.parsedInStrictMode());
    };
    return TypeParameterSyntax;
})(SyntaxNode);
var ConstraintSyntax = (function (_super) {
    __extends(ConstraintSyntax, _super);
    function ConstraintSyntax(extendsKeyword, type, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.extendsKeyword = extendsKeyword;
        this.type = type;
    }
    ConstraintSyntax.prototype.accept = function (visitor) {
        return visitor.visitConstraint(this);
    };
    ConstraintSyntax.prototype.kind = function () {
        return 236 /* Constraint */ ;
    };
    ConstraintSyntax.prototype.childCount = function () {
        return 2;
    };
    ConstraintSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.extendsKeyword;
            case 1:
                return this.type;
            default:
                throw Errors.invalidOperation();
        }
    };
    ConstraintSyntax.prototype.update = function (extendsKeyword, type) {
        if(this.extendsKeyword === extendsKeyword && this.type === type) {
            return this;
        }
        return new ConstraintSyntax(extendsKeyword, type, this.parsedInStrictMode());
    };
    return ConstraintSyntax;
})(SyntaxNode);
var ElseClauseSyntax = (function (_super) {
    __extends(ElseClauseSyntax, _super);
    function ElseClauseSyntax(elseKeyword, statement, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.elseKeyword = elseKeyword;
        this.statement = statement;
    }
    ElseClauseSyntax.prototype.accept = function (visitor) {
        return visitor.visitElseClause(this);
    };
    ElseClauseSyntax.prototype.kind = function () {
        return 232 /* ElseClause */ ;
    };
    ElseClauseSyntax.prototype.childCount = function () {
        return 2;
    };
    ElseClauseSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.elseKeyword;
            case 1:
                return this.statement;
            default:
                throw Errors.invalidOperation();
        }
    };
    ElseClauseSyntax.prototype.update = function (elseKeyword, statement) {
        if(this.elseKeyword === elseKeyword && this.statement === statement) {
            return this;
        }
        return new ElseClauseSyntax(elseKeyword, statement, this.parsedInStrictMode());
    };
    return ElseClauseSyntax;
})(SyntaxNode);
var IfStatementSyntax = (function (_super) {
    __extends(IfStatementSyntax, _super);
    function IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.ifKeyword = ifKeyword;
        this.openParenToken = openParenToken;
        this.condition = condition;
        this.closeParenToken = closeParenToken;
        this.statement = statement;
        this.elseClause = elseClause;
    }
    IfStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitIfStatement(this);
    };
    IfStatementSyntax.prototype.kind = function () {
        return 144 /* IfStatement */ ;
    };
    IfStatementSyntax.prototype.childCount = function () {
        return 6;
    };
    IfStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.ifKeyword;
            case 1:
                return this.openParenToken;
            case 2:
                return this.condition;
            case 3:
                return this.closeParenToken;
            case 4:
                return this.statement;
            case 5:
                return this.elseClause;
            default:
                throw Errors.invalidOperation();
        }
    };
    IfStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    IfStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    IfStatementSyntax.prototype.update = function (ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause) {
        if(this.ifKeyword === ifKeyword && this.openParenToken === openParenToken && this.condition === condition && this.closeParenToken === closeParenToken && this.statement === statement && this.elseClause === elseClause) {
            return this;
        }
        return new IfStatementSyntax(ifKeyword, openParenToken, condition, closeParenToken, statement, elseClause, this.parsedInStrictMode());
    };
    return IfStatementSyntax;
})(SyntaxNode);
var ExpressionStatementSyntax = (function (_super) {
    __extends(ExpressionStatementSyntax, _super);
    function ExpressionStatementSyntax(expression, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.expression = expression;
        this.semicolonToken = semicolonToken;
    }
    ExpressionStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitExpressionStatement(this);
    };
    ExpressionStatementSyntax.prototype.kind = function () {
        return 146 /* ExpressionStatement */ ;
    };
    ExpressionStatementSyntax.prototype.childCount = function () {
        return 2;
    };
    ExpressionStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.expression;
            case 1:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ExpressionStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    ExpressionStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    ExpressionStatementSyntax.prototype.update = function (expression, semicolonToken) {
        if(this.expression === expression && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new ExpressionStatementSyntax(expression, semicolonToken, this.parsedInStrictMode());
    };
    return ExpressionStatementSyntax;
})(SyntaxNode);
var ConstructorDeclarationSyntax = (function (_super) {
    __extends(ConstructorDeclarationSyntax, _super);
    function ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.constructorKeyword = constructorKeyword;
        this.parameterList = parameterList;
        this.block = block;
        this.semicolonToken = semicolonToken;
    }
    ConstructorDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitConstructorDeclaration(this);
    };
    ConstructorDeclarationSyntax.prototype.kind = function () {
        return 135 /* ConstructorDeclaration */ ;
    };
    ConstructorDeclarationSyntax.prototype.childCount = function () {
        return 4;
    };
    ConstructorDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.constructorKeyword;
            case 1:
                return this.parameterList;
            case 2:
                return this.block;
            case 3:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ConstructorDeclarationSyntax.prototype.isClassElement = function () {
        return true;
    };
    ConstructorDeclarationSyntax.prototype.update = function (constructorKeyword, parameterList, block, semicolonToken) {
        if(this.constructorKeyword === constructorKeyword && this.parameterList === parameterList && this.block === block && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new ConstructorDeclarationSyntax(constructorKeyword, parameterList, block, semicolonToken, this.parsedInStrictMode());
    };
    return ConstructorDeclarationSyntax;
})(SyntaxNode);
var MemberFunctionDeclarationSyntax = (function (_super) {
    __extends(MemberFunctionDeclarationSyntax, _super);
    function MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.publicOrPrivateKeyword = publicOrPrivateKeyword;
        this.staticKeyword = staticKeyword;
        this.functionSignature = functionSignature;
        this.block = block;
        this.semicolonToken = semicolonToken;
    }
    MemberFunctionDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitMemberFunctionDeclaration(this);
    };
    MemberFunctionDeclarationSyntax.prototype.kind = function () {
        return 133 /* MemberFunctionDeclaration */ ;
    };
    MemberFunctionDeclarationSyntax.prototype.childCount = function () {
        return 5;
    };
    MemberFunctionDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.publicOrPrivateKeyword;
            case 1:
                return this.staticKeyword;
            case 2:
                return this.functionSignature;
            case 3:
                return this.block;
            case 4:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    MemberFunctionDeclarationSyntax.prototype.isMemberDeclaration = function () {
        return true;
    };
    MemberFunctionDeclarationSyntax.prototype.isClassElement = function () {
        return true;
    };
    MemberFunctionDeclarationSyntax.prototype.update = function (publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken) {
        if(this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.staticKeyword === staticKeyword && this.functionSignature === functionSignature && this.block === block && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new MemberFunctionDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, functionSignature, block, semicolonToken, this.parsedInStrictMode());
    };
    return MemberFunctionDeclarationSyntax;
})(SyntaxNode);
var MemberAccessorDeclarationSyntax = (function (_super) {
    __extends(MemberAccessorDeclarationSyntax, _super);
    function MemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, identifier, parameterList, block, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.publicOrPrivateKeyword = publicOrPrivateKeyword;
        this.staticKeyword = staticKeyword;
        this.identifier = identifier;
        this.parameterList = parameterList;
        this.block = block;
    }
    MemberAccessorDeclarationSyntax.prototype.isMemberDeclaration = function () {
        return true;
    };
    MemberAccessorDeclarationSyntax.prototype.isClassElement = function () {
        return true;
    };
    return MemberAccessorDeclarationSyntax;
})(SyntaxNode);
var GetMemberAccessorDeclarationSyntax = (function (_super) {
    __extends(GetMemberAccessorDeclarationSyntax, _super);
    function GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block, parsedInStrictMode) {
        _super.call(this, publicOrPrivateKeyword, staticKeyword, identifier, parameterList, block, parsedInStrictMode);
        this.getKeyword = getKeyword;
        this.typeAnnotation = typeAnnotation;
    }
    GetMemberAccessorDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitGetMemberAccessorDeclaration(this);
    };
    GetMemberAccessorDeclarationSyntax.prototype.kind = function () {
        return 136 /* GetMemberAccessorDeclaration */ ;
    };
    GetMemberAccessorDeclarationSyntax.prototype.childCount = function () {
        return 7;
    };
    GetMemberAccessorDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.publicOrPrivateKeyword;
            case 1:
                return this.staticKeyword;
            case 2:
                return this.getKeyword;
            case 3:
                return this.identifier;
            case 4:
                return this.parameterList;
            case 5:
                return this.typeAnnotation;
            case 6:
                return this.block;
            default:
                throw Errors.invalidOperation();
        }
    };
    GetMemberAccessorDeclarationSyntax.prototype.update = function (publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block) {
        if(this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.staticKeyword === staticKeyword && this.getKeyword === getKeyword && this.identifier === identifier && this.parameterList === parameterList && this.typeAnnotation === typeAnnotation && this.block === block) {
            return this;
        }
        return new GetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, getKeyword, identifier, parameterList, typeAnnotation, block, this.parsedInStrictMode());
    };
    return GetMemberAccessorDeclarationSyntax;
})(MemberAccessorDeclarationSyntax);
var SetMemberAccessorDeclarationSyntax = (function (_super) {
    __extends(SetMemberAccessorDeclarationSyntax, _super);
    function SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block, parsedInStrictMode) {
        _super.call(this, publicOrPrivateKeyword, staticKeyword, identifier, parameterList, block, parsedInStrictMode);
        this.setKeyword = setKeyword;
    }
    SetMemberAccessorDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitSetMemberAccessorDeclaration(this);
    };
    SetMemberAccessorDeclarationSyntax.prototype.kind = function () {
        return 137 /* SetMemberAccessorDeclaration */ ;
    };
    SetMemberAccessorDeclarationSyntax.prototype.childCount = function () {
        return 6;
    };
    SetMemberAccessorDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.publicOrPrivateKeyword;
            case 1:
                return this.staticKeyword;
            case 2:
                return this.setKeyword;
            case 3:
                return this.identifier;
            case 4:
                return this.parameterList;
            case 5:
                return this.block;
            default:
                throw Errors.invalidOperation();
        }
    };
    SetMemberAccessorDeclarationSyntax.prototype.update = function (publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block) {
        if(this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.staticKeyword === staticKeyword && this.setKeyword === setKeyword && this.identifier === identifier && this.parameterList === parameterList && this.block === block) {
            return this;
        }
        return new SetMemberAccessorDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, setKeyword, identifier, parameterList, block, this.parsedInStrictMode());
    };
    return SetMemberAccessorDeclarationSyntax;
})(MemberAccessorDeclarationSyntax);
var MemberVariableDeclarationSyntax = (function (_super) {
    __extends(MemberVariableDeclarationSyntax, _super);
    function MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.publicOrPrivateKeyword = publicOrPrivateKeyword;
        this.staticKeyword = staticKeyword;
        this.variableDeclarator = variableDeclarator;
        this.semicolonToken = semicolonToken;
    }
    MemberVariableDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitMemberVariableDeclaration(this);
    };
    MemberVariableDeclarationSyntax.prototype.kind = function () {
        return 134 /* MemberVariableDeclaration */ ;
    };
    MemberVariableDeclarationSyntax.prototype.childCount = function () {
        return 4;
    };
    MemberVariableDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.publicOrPrivateKeyword;
            case 1:
                return this.staticKeyword;
            case 2:
                return this.variableDeclarator;
            case 3:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    MemberVariableDeclarationSyntax.prototype.isMemberDeclaration = function () {
        return true;
    };
    MemberVariableDeclarationSyntax.prototype.isClassElement = function () {
        return true;
    };
    MemberVariableDeclarationSyntax.prototype.update = function (publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken) {
        if(this.publicOrPrivateKeyword === publicOrPrivateKeyword && this.staticKeyword === staticKeyword && this.variableDeclarator === variableDeclarator && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new MemberVariableDeclarationSyntax(publicOrPrivateKeyword, staticKeyword, variableDeclarator, semicolonToken, this.parsedInStrictMode());
    };
    return MemberVariableDeclarationSyntax;
})(SyntaxNode);
var ThrowStatementSyntax = (function (_super) {
    __extends(ThrowStatementSyntax, _super);
    function ThrowStatementSyntax(throwKeyword, expression, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.throwKeyword = throwKeyword;
        this.expression = expression;
        this.semicolonToken = semicolonToken;
    }
    ThrowStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitThrowStatement(this);
    };
    ThrowStatementSyntax.prototype.kind = function () {
        return 154 /* ThrowStatement */ ;
    };
    ThrowStatementSyntax.prototype.childCount = function () {
        return 3;
    };
    ThrowStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.throwKeyword;
            case 1:
                return this.expression;
            case 2:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ThrowStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    ThrowStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    ThrowStatementSyntax.prototype.update = function (throwKeyword, expression, semicolonToken) {
        if(this.throwKeyword === throwKeyword && this.expression === expression && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new ThrowStatementSyntax(throwKeyword, expression, semicolonToken, this.parsedInStrictMode());
    };
    return ThrowStatementSyntax;
})(SyntaxNode);
var ReturnStatementSyntax = (function (_super) {
    __extends(ReturnStatementSyntax, _super);
    function ReturnStatementSyntax(returnKeyword, expression, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.returnKeyword = returnKeyword;
        this.expression = expression;
        this.semicolonToken = semicolonToken;
    }
    ReturnStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitReturnStatement(this);
    };
    ReturnStatementSyntax.prototype.kind = function () {
        return 147 /* ReturnStatement */ ;
    };
    ReturnStatementSyntax.prototype.childCount = function () {
        return 3;
    };
    ReturnStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.returnKeyword;
            case 1:
                return this.expression;
            case 2:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ReturnStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    ReturnStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    ReturnStatementSyntax.prototype.update = function (returnKeyword, expression, semicolonToken) {
        if(this.returnKeyword === returnKeyword && this.expression === expression && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new ReturnStatementSyntax(returnKeyword, expression, semicolonToken, this.parsedInStrictMode());
    };
    return ReturnStatementSyntax;
})(SyntaxNode);
var ObjectCreationExpressionSyntax = (function (_super) {
    __extends(ObjectCreationExpressionSyntax, _super);
    function ObjectCreationExpressionSyntax(newKeyword, expression, argumentList, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.newKeyword = newKeyword;
        this.expression = expression;
        this.argumentList = argumentList;
    }
    ObjectCreationExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitObjectCreationExpression(this);
    };
    ObjectCreationExpressionSyntax.prototype.kind = function () {
        return 213 /* ObjectCreationExpression */ ;
    };
    ObjectCreationExpressionSyntax.prototype.childCount = function () {
        return 3;
    };
    ObjectCreationExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.newKeyword;
            case 1:
                return this.expression;
            case 2:
                return this.argumentList;
            default:
                throw Errors.invalidOperation();
        }
    };
    ObjectCreationExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ObjectCreationExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    ObjectCreationExpressionSyntax.prototype.update = function (newKeyword, expression, argumentList) {
        if(this.newKeyword === newKeyword && this.expression === expression && this.argumentList === argumentList) {
            return this;
        }
        return new ObjectCreationExpressionSyntax(newKeyword, expression, argumentList, this.parsedInStrictMode());
    };
    return ObjectCreationExpressionSyntax;
})(SyntaxNode);
var SwitchStatementSyntax = (function (_super) {
    __extends(SwitchStatementSyntax, _super);
    function SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.switchKeyword = switchKeyword;
        this.openParenToken = openParenToken;
        this.expression = expression;
        this.closeParenToken = closeParenToken;
        this.openBraceToken = openBraceToken;
        this.switchClauses = switchClauses;
        this.closeBraceToken = closeBraceToken;
    }
    SwitchStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitSwitchStatement(this);
    };
    SwitchStatementSyntax.prototype.kind = function () {
        return 148 /* SwitchStatement */ ;
    };
    SwitchStatementSyntax.prototype.childCount = function () {
        return 7;
    };
    SwitchStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.switchKeyword;
            case 1:
                return this.openParenToken;
            case 2:
                return this.expression;
            case 3:
                return this.closeParenToken;
            case 4:
                return this.openBraceToken;
            case 5:
                return this.switchClauses;
            case 6:
                return this.closeBraceToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    SwitchStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    SwitchStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    SwitchStatementSyntax.prototype.update = function (switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken) {
        if(this.switchKeyword === switchKeyword && this.openParenToken === openParenToken && this.expression === expression && this.closeParenToken === closeParenToken && this.openBraceToken === openBraceToken && this.switchClauses === switchClauses && this.closeBraceToken === closeBraceToken) {
            return this;
        }
        return new SwitchStatementSyntax(switchKeyword, openParenToken, expression, closeParenToken, openBraceToken, switchClauses, closeBraceToken, this.parsedInStrictMode());
    };
    return SwitchStatementSyntax;
})(SyntaxNode);
var SwitchClauseSyntax = (function (_super) {
    __extends(SwitchClauseSyntax, _super);
    function SwitchClauseSyntax(colonToken, statements, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.colonToken = colonToken;
        this.statements = statements;
    }
    SwitchClauseSyntax.prototype.isSwitchClause = function () {
        return true;
    };
    return SwitchClauseSyntax;
})(SyntaxNode);
var CaseSwitchClauseSyntax = (function (_super) {
    __extends(CaseSwitchClauseSyntax, _super);
    function CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements, parsedInStrictMode) {
        _super.call(this, colonToken, statements, parsedInStrictMode);
        this.caseKeyword = caseKeyword;
        this.expression = expression;
    }
    CaseSwitchClauseSyntax.prototype.accept = function (visitor) {
        return visitor.visitCaseSwitchClause(this);
    };
    CaseSwitchClauseSyntax.prototype.kind = function () {
        return 230 /* CaseSwitchClause */ ;
    };
    CaseSwitchClauseSyntax.prototype.childCount = function () {
        return 4;
    };
    CaseSwitchClauseSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.caseKeyword;
            case 1:
                return this.expression;
            case 2:
                return this.colonToken;
            case 3:
                return this.statements;
            default:
                throw Errors.invalidOperation();
        }
    };
    CaseSwitchClauseSyntax.prototype.update = function (caseKeyword, expression, colonToken, statements) {
        if(this.caseKeyword === caseKeyword && this.expression === expression && this.colonToken === colonToken && this.statements === statements) {
            return this;
        }
        return new CaseSwitchClauseSyntax(caseKeyword, expression, colonToken, statements, this.parsedInStrictMode());
    };
    return CaseSwitchClauseSyntax;
})(SwitchClauseSyntax);
var DefaultSwitchClauseSyntax = (function (_super) {
    __extends(DefaultSwitchClauseSyntax, _super);
    function DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements, parsedInStrictMode) {
        _super.call(this, colonToken, statements, parsedInStrictMode);
        this.defaultKeyword = defaultKeyword;
    }
    DefaultSwitchClauseSyntax.prototype.accept = function (visitor) {
        return visitor.visitDefaultSwitchClause(this);
    };
    DefaultSwitchClauseSyntax.prototype.kind = function () {
        return 231 /* DefaultSwitchClause */ ;
    };
    DefaultSwitchClauseSyntax.prototype.childCount = function () {
        return 3;
    };
    DefaultSwitchClauseSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.defaultKeyword;
            case 1:
                return this.colonToken;
            case 2:
                return this.statements;
            default:
                throw Errors.invalidOperation();
        }
    };
    DefaultSwitchClauseSyntax.prototype.update = function (defaultKeyword, colonToken, statements) {
        if(this.defaultKeyword === defaultKeyword && this.colonToken === colonToken && this.statements === statements) {
            return this;
        }
        return new DefaultSwitchClauseSyntax(defaultKeyword, colonToken, statements, this.parsedInStrictMode());
    };
    return DefaultSwitchClauseSyntax;
})(SwitchClauseSyntax);
var BreakStatementSyntax = (function (_super) {
    __extends(BreakStatementSyntax, _super);
    function BreakStatementSyntax(breakKeyword, identifier, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.breakKeyword = breakKeyword;
        this.identifier = identifier;
        this.semicolonToken = semicolonToken;
    }
    BreakStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitBreakStatement(this);
    };
    BreakStatementSyntax.prototype.kind = function () {
        return 149 /* BreakStatement */ ;
    };
    BreakStatementSyntax.prototype.childCount = function () {
        return 3;
    };
    BreakStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.breakKeyword;
            case 1:
                return this.identifier;
            case 2:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    BreakStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    BreakStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    BreakStatementSyntax.prototype.update = function (breakKeyword, identifier, semicolonToken) {
        if(this.breakKeyword === breakKeyword && this.identifier === identifier && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new BreakStatementSyntax(breakKeyword, identifier, semicolonToken, this.parsedInStrictMode());
    };
    return BreakStatementSyntax;
})(SyntaxNode);
var ContinueStatementSyntax = (function (_super) {
    __extends(ContinueStatementSyntax, _super);
    function ContinueStatementSyntax(continueKeyword, identifier, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.continueKeyword = continueKeyword;
        this.identifier = identifier;
        this.semicolonToken = semicolonToken;
    }
    ContinueStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitContinueStatement(this);
    };
    ContinueStatementSyntax.prototype.kind = function () {
        return 150 /* ContinueStatement */ ;
    };
    ContinueStatementSyntax.prototype.childCount = function () {
        return 3;
    };
    ContinueStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.continueKeyword;
            case 1:
                return this.identifier;
            case 2:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ContinueStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    ContinueStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    ContinueStatementSyntax.prototype.update = function (continueKeyword, identifier, semicolonToken) {
        if(this.continueKeyword === continueKeyword && this.identifier === identifier && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new ContinueStatementSyntax(continueKeyword, identifier, semicolonToken, this.parsedInStrictMode());
    };
    return ContinueStatementSyntax;
})(SyntaxNode);
var IterationStatementSyntax = (function (_super) {
    __extends(IterationStatementSyntax, _super);
    function IterationStatementSyntax(openParenToken, closeParenToken, statement, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.openParenToken = openParenToken;
        this.closeParenToken = closeParenToken;
        this.statement = statement;
    }
    IterationStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    IterationStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    return IterationStatementSyntax;
})(SyntaxNode);
var BaseForStatementSyntax = (function (_super) {
    __extends(BaseForStatementSyntax, _super);
    function BaseForStatementSyntax(forKeyword, openParenToken, variableDeclaration, closeParenToken, statement, parsedInStrictMode) {
        _super.call(this, openParenToken, closeParenToken, statement, parsedInStrictMode);
        this.forKeyword = forKeyword;
        this.variableDeclaration = variableDeclaration;
    }
    return BaseForStatementSyntax;
})(IterationStatementSyntax);
var ForStatementSyntax = (function (_super) {
    __extends(ForStatementSyntax, _super);
    function ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement, parsedInStrictMode) {
        _super.call(this, forKeyword, openParenToken, variableDeclaration, closeParenToken, statement, parsedInStrictMode);
        this.initializer = initializer;
        this.firstSemicolonToken = firstSemicolonToken;
        this.condition = condition;
        this.secondSemicolonToken = secondSemicolonToken;
        this.incrementor = incrementor;
    }
    ForStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitForStatement(this);
    };
    ForStatementSyntax.prototype.kind = function () {
        return 151 /* ForStatement */ ;
    };
    ForStatementSyntax.prototype.childCount = function () {
        return 10;
    };
    ForStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.forKeyword;
            case 1:
                return this.openParenToken;
            case 2:
                return this.variableDeclaration;
            case 3:
                return this.initializer;
            case 4:
                return this.firstSemicolonToken;
            case 5:
                return this.condition;
            case 6:
                return this.secondSemicolonToken;
            case 7:
                return this.incrementor;
            case 8:
                return this.closeParenToken;
            case 9:
                return this.statement;
            default:
                throw Errors.invalidOperation();
        }
    };
    ForStatementSyntax.prototype.update = function (forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement) {
        if(this.forKeyword === forKeyword && this.openParenToken === openParenToken && this.variableDeclaration === variableDeclaration && this.initializer === initializer && this.firstSemicolonToken === firstSemicolonToken && this.condition === condition && this.secondSemicolonToken === secondSemicolonToken && this.incrementor === incrementor && this.closeParenToken === closeParenToken && this.statement === statement) {
            return this;
        }
        return new ForStatementSyntax(forKeyword, openParenToken, variableDeclaration, initializer, firstSemicolonToken, condition, secondSemicolonToken, incrementor, closeParenToken, statement, this.parsedInStrictMode());
    };
    return ForStatementSyntax;
})(BaseForStatementSyntax);
var ForInStatementSyntax = (function (_super) {
    __extends(ForInStatementSyntax, _super);
    function ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement, parsedInStrictMode) {
        _super.call(this, forKeyword, openParenToken, variableDeclaration, closeParenToken, statement, parsedInStrictMode);
        this.left = left;
        this.inKeyword = inKeyword;
        this.expression = expression;
    }
    ForInStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitForInStatement(this);
    };
    ForInStatementSyntax.prototype.kind = function () {
        return 152 /* ForInStatement */ ;
    };
    ForInStatementSyntax.prototype.childCount = function () {
        return 8;
    };
    ForInStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.forKeyword;
            case 1:
                return this.openParenToken;
            case 2:
                return this.variableDeclaration;
            case 3:
                return this.left;
            case 4:
                return this.inKeyword;
            case 5:
                return this.expression;
            case 6:
                return this.closeParenToken;
            case 7:
                return this.statement;
            default:
                throw Errors.invalidOperation();
        }
    };
    ForInStatementSyntax.prototype.update = function (forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement) {
        if(this.forKeyword === forKeyword && this.openParenToken === openParenToken && this.variableDeclaration === variableDeclaration && this.left === left && this.inKeyword === inKeyword && this.expression === expression && this.closeParenToken === closeParenToken && this.statement === statement) {
            return this;
        }
        return new ForInStatementSyntax(forKeyword, openParenToken, variableDeclaration, left, inKeyword, expression, closeParenToken, statement, this.parsedInStrictMode());
    };
    return ForInStatementSyntax;
})(BaseForStatementSyntax);
var WhileStatementSyntax = (function (_super) {
    __extends(WhileStatementSyntax, _super);
    function WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement, parsedInStrictMode) {
        _super.call(this, openParenToken, closeParenToken, statement, parsedInStrictMode);
        this.whileKeyword = whileKeyword;
        this.condition = condition;
    }
    WhileStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitWhileStatement(this);
    };
    WhileStatementSyntax.prototype.kind = function () {
        return 155 /* WhileStatement */ ;
    };
    WhileStatementSyntax.prototype.childCount = function () {
        return 5;
    };
    WhileStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.whileKeyword;
            case 1:
                return this.openParenToken;
            case 2:
                return this.condition;
            case 3:
                return this.closeParenToken;
            case 4:
                return this.statement;
            default:
                throw Errors.invalidOperation();
        }
    };
    WhileStatementSyntax.prototype.update = function (whileKeyword, openParenToken, condition, closeParenToken, statement) {
        if(this.whileKeyword === whileKeyword && this.openParenToken === openParenToken && this.condition === condition && this.closeParenToken === closeParenToken && this.statement === statement) {
            return this;
        }
        return new WhileStatementSyntax(whileKeyword, openParenToken, condition, closeParenToken, statement, this.parsedInStrictMode());
    };
    return WhileStatementSyntax;
})(IterationStatementSyntax);
var WithStatementSyntax = (function (_super) {
    __extends(WithStatementSyntax, _super);
    function WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.withKeyword = withKeyword;
        this.openParenToken = openParenToken;
        this.condition = condition;
        this.closeParenToken = closeParenToken;
        this.statement = statement;
    }
    WithStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitWithStatement(this);
    };
    WithStatementSyntax.prototype.kind = function () {
        return 160 /* WithStatement */ ;
    };
    WithStatementSyntax.prototype.childCount = function () {
        return 5;
    };
    WithStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.withKeyword;
            case 1:
                return this.openParenToken;
            case 2:
                return this.condition;
            case 3:
                return this.closeParenToken;
            case 4:
                return this.statement;
            default:
                throw Errors.invalidOperation();
        }
    };
    WithStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    WithStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    WithStatementSyntax.prototype.update = function (withKeyword, openParenToken, condition, closeParenToken, statement) {
        if(this.withKeyword === withKeyword && this.openParenToken === openParenToken && this.condition === condition && this.closeParenToken === closeParenToken && this.statement === statement) {
            return this;
        }
        return new WithStatementSyntax(withKeyword, openParenToken, condition, closeParenToken, statement, this.parsedInStrictMode());
    };
    return WithStatementSyntax;
})(SyntaxNode);
var EnumDeclarationSyntax = (function (_super) {
    __extends(EnumDeclarationSyntax, _super);
    function EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.exportKeyword = exportKeyword;
        this.enumKeyword = enumKeyword;
        this.identifier = identifier;
        this.openBraceToken = openBraceToken;
        this.variableDeclarators = variableDeclarators;
        this.closeBraceToken = closeBraceToken;
    }
    EnumDeclarationSyntax.prototype.accept = function (visitor) {
        return visitor.visitEnumDeclaration(this);
    };
    EnumDeclarationSyntax.prototype.kind = function () {
        return 131 /* EnumDeclaration */ ;
    };
    EnumDeclarationSyntax.prototype.childCount = function () {
        return 6;
    };
    EnumDeclarationSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.exportKeyword;
            case 1:
                return this.enumKeyword;
            case 2:
                return this.identifier;
            case 3:
                return this.openBraceToken;
            case 4:
                return this.variableDeclarators;
            case 5:
                return this.closeBraceToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    EnumDeclarationSyntax.prototype.isModuleElement = function () {
        return true;
    };
    EnumDeclarationSyntax.prototype.update = function (exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken) {
        if(this.exportKeyword === exportKeyword && this.enumKeyword === enumKeyword && this.identifier === identifier && this.openBraceToken === openBraceToken && this.variableDeclarators === variableDeclarators && this.closeBraceToken === closeBraceToken) {
            return this;
        }
        return new EnumDeclarationSyntax(exportKeyword, enumKeyword, identifier, openBraceToken, variableDeclarators, closeBraceToken, this.parsedInStrictMode());
    };
    return EnumDeclarationSyntax;
})(SyntaxNode);
var CastExpressionSyntax = (function (_super) {
    __extends(CastExpressionSyntax, _super);
    function CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.lessThanToken = lessThanToken;
        this.type = type;
        this.greaterThanToken = greaterThanToken;
        this.expression = expression;
    }
    CastExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitCastExpression(this);
    };
    CastExpressionSyntax.prototype.kind = function () {
        return 217 /* CastExpression */ ;
    };
    CastExpressionSyntax.prototype.childCount = function () {
        return 4;
    };
    CastExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.lessThanToken;
            case 1:
                return this.type;
            case 2:
                return this.greaterThanToken;
            case 3:
                return this.expression;
            default:
                throw Errors.invalidOperation();
        }
    };
    CastExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    CastExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    CastExpressionSyntax.prototype.update = function (lessThanToken, type, greaterThanToken, expression) {
        if(this.lessThanToken === lessThanToken && this.type === type && this.greaterThanToken === greaterThanToken && this.expression === expression) {
            return this;
        }
        return new CastExpressionSyntax(lessThanToken, type, greaterThanToken, expression, this.parsedInStrictMode());
    };
    return CastExpressionSyntax;
})(SyntaxNode);
var ObjectLiteralExpressionSyntax = (function (_super) {
    __extends(ObjectLiteralExpressionSyntax, _super);
    function ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.openBraceToken = openBraceToken;
        this.propertyAssignments = propertyAssignments;
        this.closeBraceToken = closeBraceToken;
    }
    ObjectLiteralExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitObjectLiteralExpression(this);
    };
    ObjectLiteralExpressionSyntax.prototype.kind = function () {
        return 212 /* ObjectLiteralExpression */ ;
    };
    ObjectLiteralExpressionSyntax.prototype.childCount = function () {
        return 3;
    };
    ObjectLiteralExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.openBraceToken;
            case 1:
                return this.propertyAssignments;
            case 2:
                return this.closeBraceToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    ObjectLiteralExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    ObjectLiteralExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    ObjectLiteralExpressionSyntax.prototype.update = function (openBraceToken, propertyAssignments, closeBraceToken) {
        if(this.openBraceToken === openBraceToken && this.propertyAssignments === propertyAssignments && this.closeBraceToken === closeBraceToken) {
            return this;
        }
        return new ObjectLiteralExpressionSyntax(openBraceToken, propertyAssignments, closeBraceToken, this.parsedInStrictMode());
    };
    return ObjectLiteralExpressionSyntax;
})(SyntaxNode);
var PropertyAssignmentSyntax = (function (_super) {
    __extends(PropertyAssignmentSyntax, _super);
    function PropertyAssignmentSyntax(propertyName, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.propertyName = propertyName;
    }
    return PropertyAssignmentSyntax;
})(SyntaxNode);
var SimplePropertyAssignmentSyntax = (function (_super) {
    __extends(SimplePropertyAssignmentSyntax, _super);
    function SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, parsedInStrictMode) {
        _super.call(this, propertyName, parsedInStrictMode);
        this.colonToken = colonToken;
        this.expression = expression;
    }
    SimplePropertyAssignmentSyntax.prototype.accept = function (visitor) {
        return visitor.visitSimplePropertyAssignment(this);
    };
    SimplePropertyAssignmentSyntax.prototype.kind = function () {
        return 239 /* SimplePropertyAssignment */ ;
    };
    SimplePropertyAssignmentSyntax.prototype.childCount = function () {
        return 3;
    };
    SimplePropertyAssignmentSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.propertyName;
            case 1:
                return this.colonToken;
            case 2:
                return this.expression;
            default:
                throw Errors.invalidOperation();
        }
    };
    SimplePropertyAssignmentSyntax.prototype.update = function (propertyName, colonToken, expression) {
        if(this.propertyName === propertyName && this.colonToken === colonToken && this.expression === expression) {
            return this;
        }
        return new SimplePropertyAssignmentSyntax(propertyName, colonToken, expression, this.parsedInStrictMode());
    };
    return SimplePropertyAssignmentSyntax;
})(PropertyAssignmentSyntax);
var AccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(AccessorPropertyAssignmentSyntax, _super);
    function AccessorPropertyAssignmentSyntax(propertyName, openParenToken, closeParenToken, block, parsedInStrictMode) {
        _super.call(this, propertyName, parsedInStrictMode);
        this.openParenToken = openParenToken;
        this.closeParenToken = closeParenToken;
        this.block = block;
    }
    return AccessorPropertyAssignmentSyntax;
})(PropertyAssignmentSyntax);
var GetAccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(GetAccessorPropertyAssignmentSyntax, _super);
    function GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block, parsedInStrictMode) {
        _super.call(this, propertyName, openParenToken, closeParenToken, block, parsedInStrictMode);
        this.getKeyword = getKeyword;
    }
    GetAccessorPropertyAssignmentSyntax.prototype.accept = function (visitor) {
        return visitor.visitGetAccessorPropertyAssignment(this);
    };
    GetAccessorPropertyAssignmentSyntax.prototype.kind = function () {
        return 242 /* GetAccessorPropertyAssignment */ ;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.childCount = function () {
        return 5;
    };
    GetAccessorPropertyAssignmentSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.getKeyword;
            case 1:
                return this.propertyName;
            case 2:
                return this.openParenToken;
            case 3:
                return this.closeParenToken;
            case 4:
                return this.block;
            default:
                throw Errors.invalidOperation();
        }
    };
    GetAccessorPropertyAssignmentSyntax.prototype.update = function (getKeyword, propertyName, openParenToken, closeParenToken, block) {
        if(this.getKeyword === getKeyword && this.propertyName === propertyName && this.openParenToken === openParenToken && this.closeParenToken === closeParenToken && this.block === block) {
            return this;
        }
        return new GetAccessorPropertyAssignmentSyntax(getKeyword, propertyName, openParenToken, closeParenToken, block, this.parsedInStrictMode());
    };
    return GetAccessorPropertyAssignmentSyntax;
})(AccessorPropertyAssignmentSyntax);
var SetAccessorPropertyAssignmentSyntax = (function (_super) {
    __extends(SetAccessorPropertyAssignmentSyntax, _super);
    function SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block, parsedInStrictMode) {
        _super.call(this, propertyName, openParenToken, closeParenToken, block, parsedInStrictMode);
        this.setKeyword = setKeyword;
        this.parameterName = parameterName;
    }
    SetAccessorPropertyAssignmentSyntax.prototype.accept = function (visitor) {
        return visitor.visitSetAccessorPropertyAssignment(this);
    };
    SetAccessorPropertyAssignmentSyntax.prototype.kind = function () {
        return 243 /* SetAccessorPropertyAssignment */ ;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.childCount = function () {
        return 6;
    };
    SetAccessorPropertyAssignmentSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.setKeyword;
            case 1:
                return this.propertyName;
            case 2:
                return this.openParenToken;
            case 3:
                return this.parameterName;
            case 4:
                return this.closeParenToken;
            case 5:
                return this.block;
            default:
                throw Errors.invalidOperation();
        }
    };
    SetAccessorPropertyAssignmentSyntax.prototype.update = function (setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block) {
        if(this.setKeyword === setKeyword && this.propertyName === propertyName && this.openParenToken === openParenToken && this.parameterName === parameterName && this.closeParenToken === closeParenToken && this.block === block) {
            return this;
        }
        return new SetAccessorPropertyAssignmentSyntax(setKeyword, propertyName, openParenToken, parameterName, closeParenToken, block, this.parsedInStrictMode());
    };
    return SetAccessorPropertyAssignmentSyntax;
})(AccessorPropertyAssignmentSyntax);
var FunctionExpressionSyntax = (function (_super) {
    __extends(FunctionExpressionSyntax, _super);
    function FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.functionKeyword = functionKeyword;
        this.identifier = identifier;
        this.callSignature = callSignature;
        this.block = block;
    }
    FunctionExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitFunctionExpression(this);
    };
    FunctionExpressionSyntax.prototype.kind = function () {
        return 219 /* FunctionExpression */ ;
    };
    FunctionExpressionSyntax.prototype.childCount = function () {
        return 4;
    };
    FunctionExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.functionKeyword;
            case 1:
                return this.identifier;
            case 2:
                return this.callSignature;
            case 3:
                return this.block;
            default:
                throw Errors.invalidOperation();
        }
    };
    FunctionExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    FunctionExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    FunctionExpressionSyntax.prototype.update = function (functionKeyword, identifier, callSignature, block) {
        if(this.functionKeyword === functionKeyword && this.identifier === identifier && this.callSignature === callSignature && this.block === block) {
            return this;
        }
        return new FunctionExpressionSyntax(functionKeyword, identifier, callSignature, block, this.parsedInStrictMode());
    };
    return FunctionExpressionSyntax;
})(SyntaxNode);
var EmptyStatementSyntax = (function (_super) {
    __extends(EmptyStatementSyntax, _super);
    function EmptyStatementSyntax(semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.semicolonToken = semicolonToken;
    }
    EmptyStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitEmptyStatement(this);
    };
    EmptyStatementSyntax.prototype.kind = function () {
        return 153 /* EmptyStatement */ ;
    };
    EmptyStatementSyntax.prototype.childCount = function () {
        return 1;
    };
    EmptyStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    EmptyStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    EmptyStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    EmptyStatementSyntax.prototype.update = function (semicolonToken) {
        if(this.semicolonToken === semicolonToken) {
            return this;
        }
        return new EmptyStatementSyntax(semicolonToken, this.parsedInStrictMode());
    };
    return EmptyStatementSyntax;
})(SyntaxNode);
var TryStatementSyntax = (function (_super) {
    __extends(TryStatementSyntax, _super);
    function TryStatementSyntax(tryKeyword, block, catchClause, finallyClause, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.tryKeyword = tryKeyword;
        this.block = block;
        this.catchClause = catchClause;
        this.finallyClause = finallyClause;
    }
    TryStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitTryStatement(this);
    };
    TryStatementSyntax.prototype.kind = function () {
        return 156 /* TryStatement */ ;
    };
    TryStatementSyntax.prototype.childCount = function () {
        return 4;
    };
    TryStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.tryKeyword;
            case 1:
                return this.block;
            case 2:
                return this.catchClause;
            case 3:
                return this.finallyClause;
            default:
                throw Errors.invalidOperation();
        }
    };
    TryStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    TryStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    TryStatementSyntax.prototype.update = function (tryKeyword, block, catchClause, finallyClause) {
        if(this.tryKeyword === tryKeyword && this.block === block && this.catchClause === catchClause && this.finallyClause === finallyClause) {
            return this;
        }
        return new TryStatementSyntax(tryKeyword, block, catchClause, finallyClause, this.parsedInStrictMode());
    };
    return TryStatementSyntax;
})(SyntaxNode);
var CatchClauseSyntax = (function (_super) {
    __extends(CatchClauseSyntax, _super);
    function CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.catchKeyword = catchKeyword;
        this.openParenToken = openParenToken;
        this.identifier = identifier;
        this.closeParenToken = closeParenToken;
        this.block = block;
    }
    CatchClauseSyntax.prototype.accept = function (visitor) {
        return visitor.visitCatchClause(this);
    };
    CatchClauseSyntax.prototype.kind = function () {
        return 233 /* CatchClause */ ;
    };
    CatchClauseSyntax.prototype.childCount = function () {
        return 5;
    };
    CatchClauseSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.catchKeyword;
            case 1:
                return this.openParenToken;
            case 2:
                return this.identifier;
            case 3:
                return this.closeParenToken;
            case 4:
                return this.block;
            default:
                throw Errors.invalidOperation();
        }
    };
    CatchClauseSyntax.prototype.update = function (catchKeyword, openParenToken, identifier, closeParenToken, block) {
        if(this.catchKeyword === catchKeyword && this.openParenToken === openParenToken && this.identifier === identifier && this.closeParenToken === closeParenToken && this.block === block) {
            return this;
        }
        return new CatchClauseSyntax(catchKeyword, openParenToken, identifier, closeParenToken, block, this.parsedInStrictMode());
    };
    return CatchClauseSyntax;
})(SyntaxNode);
var FinallyClauseSyntax = (function (_super) {
    __extends(FinallyClauseSyntax, _super);
    function FinallyClauseSyntax(finallyKeyword, block, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.finallyKeyword = finallyKeyword;
        this.block = block;
    }
    FinallyClauseSyntax.prototype.accept = function (visitor) {
        return visitor.visitFinallyClause(this);
    };
    FinallyClauseSyntax.prototype.kind = function () {
        return 234 /* FinallyClause */ ;
    };
    FinallyClauseSyntax.prototype.childCount = function () {
        return 2;
    };
    FinallyClauseSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.finallyKeyword;
            case 1:
                return this.block;
            default:
                throw Errors.invalidOperation();
        }
    };
    FinallyClauseSyntax.prototype.update = function (finallyKeyword, block) {
        if(this.finallyKeyword === finallyKeyword && this.block === block) {
            return this;
        }
        return new FinallyClauseSyntax(finallyKeyword, block, this.parsedInStrictMode());
    };
    return FinallyClauseSyntax;
})(SyntaxNode);
var LabeledStatementSyntax = (function (_super) {
    __extends(LabeledStatementSyntax, _super);
    function LabeledStatementSyntax(identifier, colonToken, statement, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.identifier = identifier;
        this.colonToken = colonToken;
        this.statement = statement;
    }
    LabeledStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitLabeledStatement(this);
    };
    LabeledStatementSyntax.prototype.kind = function () {
        return 157 /* LabeledStatement */ ;
    };
    LabeledStatementSyntax.prototype.childCount = function () {
        return 3;
    };
    LabeledStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.identifier;
            case 1:
                return this.colonToken;
            case 2:
                return this.statement;
            default:
                throw Errors.invalidOperation();
        }
    };
    LabeledStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    LabeledStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    LabeledStatementSyntax.prototype.update = function (identifier, colonToken, statement) {
        if(this.identifier === identifier && this.colonToken === colonToken && this.statement === statement) {
            return this;
        }
        return new LabeledStatementSyntax(identifier, colonToken, statement, this.parsedInStrictMode());
    };
    return LabeledStatementSyntax;
})(SyntaxNode);
var DoStatementSyntax = (function (_super) {
    __extends(DoStatementSyntax, _super);
    function DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken, parsedInStrictMode) {
        _super.call(this, openParenToken, closeParenToken, statement, parsedInStrictMode);
        this.doKeyword = doKeyword;
        this.whileKeyword = whileKeyword;
        this.condition = condition;
        this.semicolonToken = semicolonToken;
    }
    DoStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitDoStatement(this);
    };
    DoStatementSyntax.prototype.kind = function () {
        return 158 /* DoStatement */ ;
    };
    DoStatementSyntax.prototype.childCount = function () {
        return 7;
    };
    DoStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.doKeyword;
            case 1:
                return this.statement;
            case 2:
                return this.whileKeyword;
            case 3:
                return this.openParenToken;
            case 4:
                return this.condition;
            case 5:
                return this.closeParenToken;
            case 6:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    DoStatementSyntax.prototype.update = function (doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken) {
        if(this.doKeyword === doKeyword && this.statement === statement && this.whileKeyword === whileKeyword && this.openParenToken === openParenToken && this.condition === condition && this.closeParenToken === closeParenToken && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new DoStatementSyntax(doKeyword, statement, whileKeyword, openParenToken, condition, closeParenToken, semicolonToken, this.parsedInStrictMode());
    };
    return DoStatementSyntax;
})(IterationStatementSyntax);
var TypeOfExpressionSyntax = (function (_super) {
    __extends(TypeOfExpressionSyntax, _super);
    function TypeOfExpressionSyntax(typeOfKeyword, expression, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.typeOfKeyword = typeOfKeyword;
        this.expression = expression;
    }
    TypeOfExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitTypeOfExpression(this);
    };
    TypeOfExpressionSyntax.prototype.kind = function () {
        return 168 /* TypeOfExpression */ ;
    };
    TypeOfExpressionSyntax.prototype.childCount = function () {
        return 2;
    };
    TypeOfExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.typeOfKeyword;
            case 1:
                return this.expression;
            default:
                throw Errors.invalidOperation();
        }
    };
    TypeOfExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    TypeOfExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    TypeOfExpressionSyntax.prototype.update = function (typeOfKeyword, expression) {
        if(this.typeOfKeyword === typeOfKeyword && this.expression === expression) {
            return this;
        }
        return new TypeOfExpressionSyntax(typeOfKeyword, expression, this.parsedInStrictMode());
    };
    return TypeOfExpressionSyntax;
})(SyntaxNode);
var DeleteExpressionSyntax = (function (_super) {
    __extends(DeleteExpressionSyntax, _super);
    function DeleteExpressionSyntax(deleteKeyword, expression, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.deleteKeyword = deleteKeyword;
        this.expression = expression;
    }
    DeleteExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitDeleteExpression(this);
    };
    DeleteExpressionSyntax.prototype.kind = function () {
        return 167 /* DeleteExpression */ ;
    };
    DeleteExpressionSyntax.prototype.childCount = function () {
        return 2;
    };
    DeleteExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.deleteKeyword;
            case 1:
                return this.expression;
            default:
                throw Errors.invalidOperation();
        }
    };
    DeleteExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    DeleteExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    DeleteExpressionSyntax.prototype.update = function (deleteKeyword, expression) {
        if(this.deleteKeyword === deleteKeyword && this.expression === expression) {
            return this;
        }
        return new DeleteExpressionSyntax(deleteKeyword, expression, this.parsedInStrictMode());
    };
    return DeleteExpressionSyntax;
})(SyntaxNode);
var VoidExpressionSyntax = (function (_super) {
    __extends(VoidExpressionSyntax, _super);
    function VoidExpressionSyntax(voidKeyword, expression, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.voidKeyword = voidKeyword;
        this.expression = expression;
    }
    VoidExpressionSyntax.prototype.accept = function (visitor) {
        return visitor.visitVoidExpression(this);
    };
    VoidExpressionSyntax.prototype.kind = function () {
        return 169 /* VoidExpression */ ;
    };
    VoidExpressionSyntax.prototype.childCount = function () {
        return 2;
    };
    VoidExpressionSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.voidKeyword;
            case 1:
                return this.expression;
            default:
                throw Errors.invalidOperation();
        }
    };
    VoidExpressionSyntax.prototype.isUnaryExpression = function () {
        return true;
    };
    VoidExpressionSyntax.prototype.isExpression = function () {
        return true;
    };
    VoidExpressionSyntax.prototype.update = function (voidKeyword, expression) {
        if(this.voidKeyword === voidKeyword && this.expression === expression) {
            return this;
        }
        return new VoidExpressionSyntax(voidKeyword, expression, this.parsedInStrictMode());
    };
    return VoidExpressionSyntax;
})(SyntaxNode);
var DebuggerStatementSyntax = (function (_super) {
    __extends(DebuggerStatementSyntax, _super);
    function DebuggerStatementSyntax(debuggerKeyword, semicolonToken, parsedInStrictMode) {
        _super.call(this, parsedInStrictMode);
        this.debuggerKeyword = debuggerKeyword;
        this.semicolonToken = semicolonToken;
    }
    DebuggerStatementSyntax.prototype.accept = function (visitor) {
        return visitor.visitDebuggerStatement(this);
    };
    DebuggerStatementSyntax.prototype.kind = function () {
        return 159 /* DebuggerStatement */ ;
    };
    DebuggerStatementSyntax.prototype.childCount = function () {
        return 2;
    };
    DebuggerStatementSyntax.prototype.childAt = function (slot) {
        switch(slot) {
            case 0:
                return this.debuggerKeyword;
            case 1:
                return this.semicolonToken;
            default:
                throw Errors.invalidOperation();
        }
    };
    DebuggerStatementSyntax.prototype.isStatement = function () {
        return true;
    };
    DebuggerStatementSyntax.prototype.isModuleElement = function () {
        return true;
    };
    DebuggerStatementSyntax.prototype.update = function (debuggerKeyword, semicolonToken) {
        if(this.debuggerKeyword === debuggerKeyword && this.semicolonToken === semicolonToken) {
            return this;
        }
        return new DebuggerStatementSyntax(debuggerKeyword, semicolonToken, this.parsedInStrictMode());
    };
    return DebuggerStatementSyntax;
})(SyntaxNode);
var SyntaxRewriter = (function () {
    function SyntaxRewriter() { }
    SyntaxRewriter.prototype.visitToken = function (token) {
        return token;
    };
    SyntaxRewriter.prototype.visitNode = function (node) {
        return node.accept(this);
    };
    SyntaxRewriter.prototype.visitNodeOrToken = function (node) {
        return node.isToken() ? this.visitToken(node) : this.visitNode(node);
    };
    SyntaxRewriter.prototype.visitList = function (list) {
        var newItems = null;
        for(var i = 0, n = list.childCount(); i < n; i++) {
            var item = list.childAt(i);
            var newItem = this.visitNodeOrToken(item);
            if(item !== newItem && newItems === null) {
                newItems = [];
                for(var j = 0; j < i; j++) {
                    newItems.push(list.childAt(j));
                }
            }
            if(newItems) {
                newItems.push(newItem);
            }
        }
        return newItems === null ? list : Syntax.list(newItems);
    };
    SyntaxRewriter.prototype.visitSeparatedList = function (list) {
        var newItems = null;
        for(var i = 0, n = list.childCount(); i < n; i++) {
            var item = list.childAt(i);
            var newItem = item.isToken() ? this.visitToken(item) : this.visitNode(item);
            if(item !== newItem && newItems === null) {
                newItems = [];
                for(var j = 0; j < i; j++) {
                    newItems.push(list.childAt(j));
                }
            }
            if(newItems) {
                newItems.push(newItem);
            }
        }
        return newItems === null ? list : Syntax.separatedList(newItems);
    };
    SyntaxRewriter.prototype.visitSourceUnit = function (node) {
        return node.update(this.visitList(node.moduleElements), this.visitToken(node.endOfFileToken));
    };
    SyntaxRewriter.prototype.visitExternalModuleReference = function (node) {
        return node.update(this.visitToken(node.moduleKeyword), this.visitToken(node.openParenToken), this.visitToken(node.stringLiteral), this.visitToken(node.closeParenToken));
    };
    SyntaxRewriter.prototype.visitModuleNameModuleReference = function (node) {
        return node.update(this.visitNodeOrToken(node.moduleName));
    };
    SyntaxRewriter.prototype.visitImportDeclaration = function (node) {
        return node.update(this.visitToken(node.importKeyword), this.visitToken(node.identifier), this.visitToken(node.equalsToken), this.visitNode(node.moduleReference), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitClassDeclaration = function (node) {
        return node.update(node.exportKeyword === null ? null : this.visitToken(node.exportKeyword), node.declareKeyword === null ? null : this.visitToken(node.declareKeyword), this.visitToken(node.classKeyword), this.visitToken(node.identifier), node.typeParameterList === null ? null : this.visitNode(node.typeParameterList), node.extendsClause === null ? null : this.visitNode(node.extendsClause), node.implementsClause === null ? null : this.visitNode(node.implementsClause), this.visitToken(node.openBraceToken), this.visitList(node.classElements), this.visitToken(node.closeBraceToken));
    };
    SyntaxRewriter.prototype.visitInterfaceDeclaration = function (node) {
        return node.update(node.exportKeyword === null ? null : this.visitToken(node.exportKeyword), this.visitToken(node.interfaceKeyword), this.visitToken(node.identifier), node.typeParameterList === null ? null : this.visitNode(node.typeParameterList), node.extendsClause === null ? null : this.visitNode(node.extendsClause), this.visitNode(node.body));
    };
    SyntaxRewriter.prototype.visitExtendsClause = function (node) {
        return node.update(this.visitToken(node.extendsKeyword), this.visitSeparatedList(node.typeNames));
    };
    SyntaxRewriter.prototype.visitImplementsClause = function (node) {
        return node.update(this.visitToken(node.implementsKeyword), this.visitSeparatedList(node.typeNames));
    };
    SyntaxRewriter.prototype.visitModuleDeclaration = function (node) {
        return node.update(node.exportKeyword === null ? null : this.visitToken(node.exportKeyword), node.declareKeyword === null ? null : this.visitToken(node.declareKeyword), this.visitToken(node.moduleKeyword), node.moduleName === null ? null : this.visitNodeOrToken(node.moduleName), node.stringLiteral === null ? null : this.visitToken(node.stringLiteral), this.visitToken(node.openBraceToken), this.visitList(node.moduleElements), this.visitToken(node.closeBraceToken));
    };
    SyntaxRewriter.prototype.visitFunctionDeclaration = function (node) {
        return node.update(node.exportKeyword === null ? null : this.visitToken(node.exportKeyword), node.declareKeyword === null ? null : this.visitToken(node.declareKeyword), this.visitToken(node.functionKeyword), this.visitNode(node.functionSignature), node.block === null ? null : this.visitNode(node.block), node.semicolonToken === null ? null : this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitVariableStatement = function (node) {
        return node.update(node.exportKeyword === null ? null : this.visitToken(node.exportKeyword), node.declareKeyword === null ? null : this.visitToken(node.declareKeyword), this.visitNode(node.variableDeclaration), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitVariableDeclaration = function (node) {
        return node.update(this.visitToken(node.varKeyword), this.visitSeparatedList(node.variableDeclarators));
    };
    SyntaxRewriter.prototype.visitVariableDeclarator = function (node) {
        return node.update(this.visitToken(node.identifier), node.typeAnnotation === null ? null : this.visitNode(node.typeAnnotation), node.equalsValueClause === null ? null : this.visitNode(node.equalsValueClause));
    };
    SyntaxRewriter.prototype.visitEqualsValueClause = function (node) {
        return node.update(this.visitToken(node.equalsToken), this.visitNodeOrToken(node.value));
    };
    SyntaxRewriter.prototype.visitPrefixUnaryExpression = function (node) {
        return node.update(node.kind(), this.visitToken(node.operatorToken), this.visitNodeOrToken(node.operand));
    };
    SyntaxRewriter.prototype.visitArrayLiteralExpression = function (node) {
        return node.update(this.visitToken(node.openBracketToken), this.visitSeparatedList(node.expressions), this.visitToken(node.closeBracketToken));
    };
    SyntaxRewriter.prototype.visitOmittedExpression = function (node) {
        return node;
    };
    SyntaxRewriter.prototype.visitParenthesizedExpression = function (node) {
        return node.update(this.visitToken(node.openParenToken), this.visitNodeOrToken(node.expression), this.visitToken(node.closeParenToken));
    };
    SyntaxRewriter.prototype.visitSimpleArrowFunctionExpression = function (node) {
        return node.update(this.visitToken(node.identifier), this.visitToken(node.equalsGreaterThanToken), this.visitNodeOrToken(node.body));
    };
    SyntaxRewriter.prototype.visitParenthesizedArrowFunctionExpression = function (node) {
        return node.update(this.visitNode(node.callSignature), this.visitToken(node.equalsGreaterThanToken), this.visitNodeOrToken(node.body));
    };
    SyntaxRewriter.prototype.visitQualifiedName = function (node) {
        return node.update(this.visitNodeOrToken(node.left), this.visitToken(node.dotToken), this.visitToken(node.right));
    };
    SyntaxRewriter.prototype.visitTypeArgumentList = function (node) {
        return node.update(this.visitToken(node.lessThanToken), this.visitSeparatedList(node.typeArguments), this.visitToken(node.greaterThanToken));
    };
    SyntaxRewriter.prototype.visitConstructorType = function (node) {
        return node.update(this.visitToken(node.newKeyword), node.typeParameterList === null ? null : this.visitNode(node.typeParameterList), this.visitNode(node.parameterList), this.visitToken(node.equalsGreaterThanToken), this.visitNodeOrToken(node.type));
    };
    SyntaxRewriter.prototype.visitFunctionType = function (node) {
        return node.update(node.typeParameterList === null ? null : this.visitNode(node.typeParameterList), this.visitNode(node.parameterList), this.visitToken(node.equalsGreaterThanToken), this.visitNodeOrToken(node.type));
    };
    SyntaxRewriter.prototype.visitObjectType = function (node) {
        return node.update(this.visitToken(node.openBraceToken), this.visitSeparatedList(node.typeMembers), this.visitToken(node.closeBraceToken));
    };
    SyntaxRewriter.prototype.visitArrayType = function (node) {
        return node.update(this.visitNodeOrToken(node.type), this.visitToken(node.openBracketToken), this.visitToken(node.closeBracketToken));
    };
    SyntaxRewriter.prototype.visitGenericType = function (node) {
        return node.update(this.visitNodeOrToken(node.name), this.visitNode(node.typeArgumentList));
    };
    SyntaxRewriter.prototype.visitTypeAnnotation = function (node) {
        return node.update(this.visitToken(node.colonToken), this.visitNodeOrToken(node.type));
    };
    SyntaxRewriter.prototype.visitBlock = function (node) {
        return node.update(this.visitToken(node.openBraceToken), this.visitList(node.statements), this.visitToken(node.closeBraceToken));
    };
    SyntaxRewriter.prototype.visitParameter = function (node) {
        return node.update(node.dotDotDotToken === null ? null : this.visitToken(node.dotDotDotToken), node.publicOrPrivateKeyword === null ? null : this.visitToken(node.publicOrPrivateKeyword), this.visitToken(node.identifier), node.questionToken === null ? null : this.visitToken(node.questionToken), node.typeAnnotation === null ? null : this.visitNode(node.typeAnnotation), node.equalsValueClause === null ? null : this.visitNode(node.equalsValueClause));
    };
    SyntaxRewriter.prototype.visitMemberAccessExpression = function (node) {
        return node.update(this.visitNodeOrToken(node.expression), this.visitToken(node.dotToken), this.visitToken(node.name));
    };
    SyntaxRewriter.prototype.visitPostfixUnaryExpression = function (node) {
        return node.update(node.kind(), this.visitNodeOrToken(node.operand), this.visitToken(node.operatorToken));
    };
    SyntaxRewriter.prototype.visitElementAccessExpression = function (node) {
        return node.update(this.visitNodeOrToken(node.expression), this.visitToken(node.openBracketToken), this.visitNodeOrToken(node.argumentExpression), this.visitToken(node.closeBracketToken));
    };
    SyntaxRewriter.prototype.visitInvocationExpression = function (node) {
        return node.update(this.visitNodeOrToken(node.expression), this.visitNode(node.argumentList));
    };
    SyntaxRewriter.prototype.visitArgumentList = function (node) {
        return node.update(node.typeArgumentList === null ? null : this.visitNode(node.typeArgumentList), this.visitToken(node.openParenToken), this.visitSeparatedList(node.arguments), this.visitToken(node.closeParenToken));
    };
    SyntaxRewriter.prototype.visitBinaryExpression = function (node) {
        return node.update(node.kind(), this.visitNodeOrToken(node.left), this.visitToken(node.operatorToken), this.visitNodeOrToken(node.right));
    };
    SyntaxRewriter.prototype.visitConditionalExpression = function (node) {
        return node.update(this.visitNodeOrToken(node.condition), this.visitToken(node.questionToken), this.visitNodeOrToken(node.whenTrue), this.visitToken(node.colonToken), this.visitNodeOrToken(node.whenFalse));
    };
    SyntaxRewriter.prototype.visitConstructSignature = function (node) {
        return node.update(this.visitToken(node.newKeyword), this.visitNode(node.callSignature));
    };
    SyntaxRewriter.prototype.visitFunctionSignature = function (node) {
        return node.update(this.visitToken(node.identifier), node.questionToken === null ? null : this.visitToken(node.questionToken), this.visitNode(node.callSignature));
    };
    SyntaxRewriter.prototype.visitIndexSignature = function (node) {
        return node.update(this.visitToken(node.openBracketToken), this.visitNode(node.parameter), this.visitToken(node.closeBracketToken), node.typeAnnotation === null ? null : this.visitNode(node.typeAnnotation));
    };
    SyntaxRewriter.prototype.visitPropertySignature = function (node) {
        return node.update(this.visitToken(node.identifier), node.questionToken === null ? null : this.visitToken(node.questionToken), node.typeAnnotation === null ? null : this.visitNode(node.typeAnnotation));
    };
    SyntaxRewriter.prototype.visitParameterList = function (node) {
        return node.update(this.visitToken(node.openParenToken), this.visitSeparatedList(node.parameters), this.visitToken(node.closeParenToken));
    };
    SyntaxRewriter.prototype.visitCallSignature = function (node) {
        return node.update(node.typeParameterList === null ? null : this.visitNode(node.typeParameterList), this.visitNode(node.parameterList), node.typeAnnotation === null ? null : this.visitNode(node.typeAnnotation));
    };
    SyntaxRewriter.prototype.visitTypeParameterList = function (node) {
        return node.update(this.visitToken(node.lessThanToken), this.visitSeparatedList(node.typeParameters), this.visitToken(node.greaterThanToken));
    };
    SyntaxRewriter.prototype.visitTypeParameter = function (node) {
        return node.update(this.visitToken(node.identifier), node.constraint === null ? null : this.visitNode(node.constraint));
    };
    SyntaxRewriter.prototype.visitConstraint = function (node) {
        return node.update(this.visitToken(node.extendsKeyword), this.visitNodeOrToken(node.type));
    };
    SyntaxRewriter.prototype.visitElseClause = function (node) {
        return node.update(this.visitToken(node.elseKeyword), this.visitNodeOrToken(node.statement));
    };
    SyntaxRewriter.prototype.visitIfStatement = function (node) {
        return node.update(this.visitToken(node.ifKeyword), this.visitToken(node.openParenToken), this.visitNodeOrToken(node.condition), this.visitToken(node.closeParenToken), this.visitNodeOrToken(node.statement), node.elseClause === null ? null : this.visitNode(node.elseClause));
    };
    SyntaxRewriter.prototype.visitExpressionStatement = function (node) {
        return node.update(this.visitNodeOrToken(node.expression), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitConstructorDeclaration = function (node) {
        return node.update(this.visitToken(node.constructorKeyword), this.visitNode(node.parameterList), node.block === null ? null : this.visitNode(node.block), node.semicolonToken === null ? null : this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitMemberFunctionDeclaration = function (node) {
        return node.update(node.publicOrPrivateKeyword === null ? null : this.visitToken(node.publicOrPrivateKeyword), node.staticKeyword === null ? null : this.visitToken(node.staticKeyword), this.visitNode(node.functionSignature), node.block === null ? null : this.visitNode(node.block), node.semicolonToken === null ? null : this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitGetMemberAccessorDeclaration = function (node) {
        return node.update(node.publicOrPrivateKeyword === null ? null : this.visitToken(node.publicOrPrivateKeyword), node.staticKeyword === null ? null : this.visitToken(node.staticKeyword), this.visitToken(node.getKeyword), this.visitToken(node.identifier), this.visitNode(node.parameterList), node.typeAnnotation === null ? null : this.visitNode(node.typeAnnotation), this.visitNode(node.block));
    };
    SyntaxRewriter.prototype.visitSetMemberAccessorDeclaration = function (node) {
        return node.update(node.publicOrPrivateKeyword === null ? null : this.visitToken(node.publicOrPrivateKeyword), node.staticKeyword === null ? null : this.visitToken(node.staticKeyword), this.visitToken(node.setKeyword), this.visitToken(node.identifier), this.visitNode(node.parameterList), this.visitNode(node.block));
    };
    SyntaxRewriter.prototype.visitMemberVariableDeclaration = function (node) {
        return node.update(node.publicOrPrivateKeyword === null ? null : this.visitToken(node.publicOrPrivateKeyword), node.staticKeyword === null ? null : this.visitToken(node.staticKeyword), this.visitNode(node.variableDeclarator), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitThrowStatement = function (node) {
        return node.update(this.visitToken(node.throwKeyword), this.visitNodeOrToken(node.expression), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitReturnStatement = function (node) {
        return node.update(this.visitToken(node.returnKeyword), node.expression === null ? null : this.visitNodeOrToken(node.expression), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitObjectCreationExpression = function (node) {
        return node.update(this.visitToken(node.newKeyword), this.visitNodeOrToken(node.expression), node.argumentList === null ? null : this.visitNode(node.argumentList));
    };
    SyntaxRewriter.prototype.visitSwitchStatement = function (node) {
        return node.update(this.visitToken(node.switchKeyword), this.visitToken(node.openParenToken), this.visitNodeOrToken(node.expression), this.visitToken(node.closeParenToken), this.visitToken(node.openBraceToken), this.visitList(node.switchClauses), this.visitToken(node.closeBraceToken));
    };
    SyntaxRewriter.prototype.visitCaseSwitchClause = function (node) {
        return node.update(this.visitToken(node.caseKeyword), this.visitNodeOrToken(node.expression), this.visitToken(node.colonToken), this.visitList(node.statements));
    };
    SyntaxRewriter.prototype.visitDefaultSwitchClause = function (node) {
        return node.update(this.visitToken(node.defaultKeyword), this.visitToken(node.colonToken), this.visitList(node.statements));
    };
    SyntaxRewriter.prototype.visitBreakStatement = function (node) {
        return node.update(this.visitToken(node.breakKeyword), node.identifier === null ? null : this.visitToken(node.identifier), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitContinueStatement = function (node) {
        return node.update(this.visitToken(node.continueKeyword), node.identifier === null ? null : this.visitToken(node.identifier), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitForStatement = function (node) {
        return node.update(this.visitToken(node.forKeyword), this.visitToken(node.openParenToken), node.variableDeclaration === null ? null : this.visitNode(node.variableDeclaration), node.initializer === null ? null : this.visitNodeOrToken(node.initializer), this.visitToken(node.firstSemicolonToken), node.condition === null ? null : this.visitNodeOrToken(node.condition), this.visitToken(node.secondSemicolonToken), node.incrementor === null ? null : this.visitNodeOrToken(node.incrementor), this.visitToken(node.closeParenToken), this.visitNodeOrToken(node.statement));
    };
    SyntaxRewriter.prototype.visitForInStatement = function (node) {
        return node.update(this.visitToken(node.forKeyword), this.visitToken(node.openParenToken), node.variableDeclaration === null ? null : this.visitNode(node.variableDeclaration), node.left === null ? null : this.visitNodeOrToken(node.left), this.visitToken(node.inKeyword), this.visitNodeOrToken(node.expression), this.visitToken(node.closeParenToken), this.visitNodeOrToken(node.statement));
    };
    SyntaxRewriter.prototype.visitWhileStatement = function (node) {
        return node.update(this.visitToken(node.whileKeyword), this.visitToken(node.openParenToken), this.visitNodeOrToken(node.condition), this.visitToken(node.closeParenToken), this.visitNodeOrToken(node.statement));
    };
    SyntaxRewriter.prototype.visitWithStatement = function (node) {
        return node.update(this.visitToken(node.withKeyword), this.visitToken(node.openParenToken), this.visitNodeOrToken(node.condition), this.visitToken(node.closeParenToken), this.visitNodeOrToken(node.statement));
    };
    SyntaxRewriter.prototype.visitEnumDeclaration = function (node) {
        return node.update(node.exportKeyword === null ? null : this.visitToken(node.exportKeyword), this.visitToken(node.enumKeyword), this.visitToken(node.identifier), this.visitToken(node.openBraceToken), this.visitSeparatedList(node.variableDeclarators), this.visitToken(node.closeBraceToken));
    };
    SyntaxRewriter.prototype.visitCastExpression = function (node) {
        return node.update(this.visitToken(node.lessThanToken), this.visitNodeOrToken(node.type), this.visitToken(node.greaterThanToken), this.visitNodeOrToken(node.expression));
    };
    SyntaxRewriter.prototype.visitObjectLiteralExpression = function (node) {
        return node.update(this.visitToken(node.openBraceToken), this.visitSeparatedList(node.propertyAssignments), this.visitToken(node.closeBraceToken));
    };
    SyntaxRewriter.prototype.visitSimplePropertyAssignment = function (node) {
        return node.update(this.visitToken(node.propertyName), this.visitToken(node.colonToken), this.visitNodeOrToken(node.expression));
    };
    SyntaxRewriter.prototype.visitGetAccessorPropertyAssignment = function (node) {
        return node.update(this.visitToken(node.getKeyword), this.visitToken(node.propertyName), this.visitToken(node.openParenToken), this.visitToken(node.closeParenToken), this.visitNode(node.block));
    };
    SyntaxRewriter.prototype.visitSetAccessorPropertyAssignment = function (node) {
        return node.update(this.visitToken(node.setKeyword), this.visitToken(node.propertyName), this.visitToken(node.openParenToken), this.visitToken(node.parameterName), this.visitToken(node.closeParenToken), this.visitNode(node.block));
    };
    SyntaxRewriter.prototype.visitFunctionExpression = function (node) {
        return node.update(this.visitToken(node.functionKeyword), node.identifier === null ? null : this.visitToken(node.identifier), this.visitNode(node.callSignature), this.visitNode(node.block));
    };
    SyntaxRewriter.prototype.visitEmptyStatement = function (node) {
        return node.update(this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitTryStatement = function (node) {
        return node.update(this.visitToken(node.tryKeyword), this.visitNode(node.block), node.catchClause === null ? null : this.visitNode(node.catchClause), node.finallyClause === null ? null : this.visitNode(node.finallyClause));
    };
    SyntaxRewriter.prototype.visitCatchClause = function (node) {
        return node.update(this.visitToken(node.catchKeyword), this.visitToken(node.openParenToken), this.visitToken(node.identifier), this.visitToken(node.closeParenToken), this.visitNode(node.block));
    };
    SyntaxRewriter.prototype.visitFinallyClause = function (node) {
        return node.update(this.visitToken(node.finallyKeyword), this.visitNode(node.block));
    };
    SyntaxRewriter.prototype.visitLabeledStatement = function (node) {
        return node.update(this.visitToken(node.identifier), this.visitToken(node.colonToken), this.visitNodeOrToken(node.statement));
    };
    SyntaxRewriter.prototype.visitDoStatement = function (node) {
        return node.update(this.visitToken(node.doKeyword), this.visitNodeOrToken(node.statement), this.visitToken(node.whileKeyword), this.visitToken(node.openParenToken), this.visitNodeOrToken(node.condition), this.visitToken(node.closeParenToken), this.visitToken(node.semicolonToken));
    };
    SyntaxRewriter.prototype.visitTypeOfExpression = function (node) {
        return node.update(this.visitToken(node.typeOfKeyword), this.visitNodeOrToken(node.expression));
    };
    SyntaxRewriter.prototype.visitDeleteExpression = function (node) {
        return node.update(this.visitToken(node.deleteKeyword), this.visitNodeOrToken(node.expression));
    };
    SyntaxRewriter.prototype.visitVoidExpression = function (node) {
        return node.update(this.visitToken(node.voidKeyword), this.visitNodeOrToken(node.expression));
    };
    SyntaxRewriter.prototype.visitDebuggerStatement = function (node) {
        return node.update(this.visitToken(node.debuggerKeyword), this.visitToken(node.semicolonToken));
    };
    return SyntaxRewriter;
})();
var SyntaxTokenReplacer = (function (_super) {
    __extends(SyntaxTokenReplacer, _super);
    function SyntaxTokenReplacer(token1, token2) {
        _super.call(this);
        this.token1 = token1;
        this.token2 = token2;
    }
    SyntaxTokenReplacer.prototype.visitToken = function (token) {
        if(token === this.token1) {
            var result = this.token2;
            this.token1 = null;
            this.token2 = null;
            return result;
        }
        return token;
    };
    SyntaxTokenReplacer.prototype.visitNode = function (node) {
        if(this.token1 === null) {
            return node;
        }
        return _super.prototype.visitNode.call(this, node);
    };
    SyntaxTokenReplacer.prototype.visitList = function (list) {
        if(this.token1 === null) {
            return list;
        }
        return _super.prototype.visitList.call(this, list);
    };
    SyntaxTokenReplacer.prototype.visitSeparatedList = function (list) {
        if(this.token1 === null) {
            return list;
        }
        return _super.prototype.visitSeparatedList.call(this, list);
    };
    return SyntaxTokenReplacer;
})(SyntaxRewriter);
var SyntaxNode = (function () {
    function SyntaxNode(parsedInStrictMode) {
        this._data = parsedInStrictMode ? 8 /* NodeParsedInStrictModeMask */  : 0;
    }
    SyntaxNode.prototype.isNode = function () {
        return true;
    };
    SyntaxNode.prototype.isToken = function () {
        return false;
    };
    SyntaxNode.prototype.isList = function () {
        return false;
    };
    SyntaxNode.prototype.isSeparatedList = function () {
        return false;
    };
    SyntaxNode.prototype.kind = function () {
        throw Errors.abstract1();
    };
    SyntaxNode.prototype.childCount = function () {
        throw Errors.abstract1();
    };
    SyntaxNode.prototype.childAt = function (slot) {
        throw Errors.abstract1();
    };
    SyntaxNode.prototype.firstToken = function () {
        for(var i = 0, n = this.childCount(); i < n; i++) {
            var element = this.childAt(i);
            if(element != null) {
                if(element.fullWidth() > 0 || element.kind() === 10 /* EndOfFileToken */ ) {
                    return element.firstToken();
                }
            }
        }
        return null;
    };
    SyntaxNode.prototype.lastToken = function () {
        for(var i = this.childCount() - 1; i >= 0; i--) {
            var element = this.childAt(i);
            if(element != null) {
                if(element.fullWidth() > 0 || element.kind() === 10 /* EndOfFileToken */ ) {
                    return element.lastToken();
                }
            }
        }
        return null;
    };
    SyntaxNode.prototype.insertChildrenInto = function (array, index) {
        for(var i = this.childCount() - 1; i >= 0; i--) {
            var element = this.childAt(i);
            if(element !== null) {
                if(element.isNode() || element.isToken()) {
                    array.splice(index, 0, element);
                } else if(element.isList()) {
                    (element).insertChildrenInto(array, index);
                } else if(element.isSeparatedList()) {
                    (element).insertChildrenInto(array, index);
                } else {
                    throw Errors.invalidOperation();
                }
            }
        }
    };
    SyntaxNode.prototype.leadingTrivia = function () {
        return this.firstToken().leadingTrivia();
    };
    SyntaxNode.prototype.trailingTrivia = function () {
        return this.lastToken().trailingTrivia();
    };
    SyntaxNode.prototype.toJSON = function (key) {
        var result = {
            kind: (SyntaxKind)._map[this.kind()],
            fullWidth: this.fullWidth()
        };
        if(this.hasSkippedText()) {
            result.hasSkippedText = true;
        }
        if(this.hasZeroWidthToken()) {
            result.hasZeroWidthToken = true;
        }
        if(this.hasRegularExpressionToken()) {
            result.hasRegularExpressionToken = true;
        }
        if(this.parsedInStrictMode()) {
            result.parsedInStrictMode = true;
        }
        for(var i = 0, n = this.childCount(); i < n; i++) {
            var value = this.childAt(i);
            if(value) {
                for(var name in this) {
                    if(value === this[name]) {
                        result[name] = value;
                        break;
                    }
                }
            }
        }
        return result;
    };
    SyntaxNode.prototype.accept = function (visitor) {
        throw Errors.abstract1();
    };
    SyntaxNode.prototype.fullText = function () {
        var elements = [];
        this.collectTextElements(elements);
        return elements.join("");
    };
    SyntaxNode.prototype.collectTextElements = function (elements) {
        for(var i = 0, n = this.childCount(); i < n; i++) {
            var element = this.childAt(i);
            if(element !== null) {
                element.collectTextElements(elements);
            }
        }
    };
    SyntaxNode.prototype.replaceToken = function (token1, token2) {
        if(token1 === token2) {
            return this;
        }
        return this.accept(new SyntaxTokenReplacer(token1, token2));
    };
    SyntaxNode.prototype.withLeadingTrivia = function (trivia) {
        return this.replaceToken(this.firstToken(), this.firstToken().withLeadingTrivia(trivia));
    };
    SyntaxNode.prototype.withTrailingTrivia = function (trivia) {
        return this.replaceToken(this.lastToken(), this.lastToken().withTrailingTrivia(trivia));
    };
    SyntaxNode.prototype.hasLeadingTrivia = function () {
        return this.lastToken().hasLeadingTrivia();
    };
    SyntaxNode.prototype.hasTrailingTrivia = function () {
        return this.lastToken().hasTrailingTrivia();
    };
    SyntaxNode.prototype.isTypeScriptSpecific = function () {
        return false;
    };
    SyntaxNode.prototype.hasSkippedText = function () {
        return (this.data() & 1 /* NodeSkippedTextMask */ ) !== 0;
    };
    SyntaxNode.prototype.hasZeroWidthToken = function () {
        return (this.data() & 2 /* NodeZeroWidthTokenMask */ ) !== 0;
    };
    SyntaxNode.prototype.hasRegularExpressionToken = function () {
        return (this.data() & 4 /* NodeRegularExpressionTokenMask */ ) !== 0;
    };
    SyntaxNode.prototype.parsedInStrictMode = function () {
        return (this.data() & 8 /* NodeParsedInStrictModeMask */ ) !== 0;
    };
    SyntaxNode.prototype.fullWidth = function () {
        return this.data() >>> 4 /* NodeFullWidthShift */ ;
    };
    SyntaxNode.prototype.computeData = function () {
        var slotCount = this.childCount();
        var fullWidth = 0;
        var childWidth = 0;
        var hasSkippedText = false;
        var hasZeroWidthToken = slotCount === 0;
        var hasRegularExpressionToken = false;
        for(var i = 0, n = slotCount; i < n; i++) {
            var element = this.childAt(i);
            if(element !== null) {
                var childWidth = element.fullWidth();
                fullWidth += childWidth;
                if(!hasSkippedText) {
                    hasSkippedText = element.hasSkippedText();
                }
                if(!hasZeroWidthToken) {
                    hasZeroWidthToken = element.hasZeroWidthToken();
                }
                if(!hasRegularExpressionToken) {
                    hasRegularExpressionToken = element.hasRegularExpressionToken();
                }
            }
        }
        return (fullWidth << 4 /* NodeFullWidthShift */ ) | (hasSkippedText ? 1 /* NodeSkippedTextMask */  : 0) | (hasZeroWidthToken ? 2 /* NodeZeroWidthTokenMask */  : 0) | (hasRegularExpressionToken ? 4 /* NodeRegularExpressionTokenMask */  : 0);
    };
    SyntaxNode.prototype.data = function () {
        if(this._data === 0 || this._data === 8 /* NodeParsedInStrictModeMask */ ) {
            this._data |= this.computeData();
        }
        return this._data;
    };
    SyntaxNode.prototype.findToken = function (position) {
        var endOfFileToken = this.tryGetEndOfFileAt(position);
        if(endOfFileToken !== null) {
            return endOfFileToken;
        }
        if(position < 0 || position >= this.fullWidth()) {
            throw Errors.argumentOutOfRange("position");
        }
        return this.findTokenInternal(null, position, 0);
    };
    SyntaxNode.prototype.tryGetEndOfFileAt = function (position) {
        if(this.kind() === 120 /* SourceUnit */  && position === this.fullWidth()) {
            var sourceUnit = this;
            return new PositionedToken(new PositionedNode(null, sourceUnit, 0), sourceUnit.endOfFileToken, sourceUnit.moduleElements.fullWidth());
        }
        return null;
    };
    SyntaxNode.prototype.findTokenInternal = function (parent, position, fullStart) {
        Debug.assert(position >= 0 && position < this.fullWidth());
        parent = new PositionedNode(parent, this, fullStart);
        for(var i = 0, n = this.childCount(); i < n; i++) {
            var element = this.childAt(i);
            if(element !== null) {
                var childWidth = element.fullWidth();
                if(position < childWidth) {
                    return (element).findTokenInternal(parent, position, fullStart);
                }
                position -= childWidth;
                fullStart += childWidth;
            }
        }
        throw Errors.invalidOperation();
    };
    SyntaxNode.prototype.findTokenOnLeft = function (position) {
        var positionedToken = this.findToken(position);
        var start = positionedToken.start();
        Debug.assert(position >= positionedToken.fullStart());
        Debug.assert(position < positionedToken.fullEnd() || positionedToken.token().tokenKind === 10 /* EndOfFileToken */ );
        if(position > start) {
            return positionedToken;
        }
        if(positionedToken.fullStart() === 0) {
            return null;
        }
        var previousToken = this.findToken(positionedToken.fullStart() - 1);
        Debug.assert(previousToken.fullEnd() <= position);
        return previousToken;
    };
    SyntaxNode.prototype.isModuleElement = function () {
        return false;
    };
    SyntaxNode.prototype.isClassElement = function () {
        return false;
    };
    SyntaxNode.prototype.isTypeMember = function () {
        return false;
    };
    SyntaxNode.prototype.isStatement = function () {
        return false;
    };
    SyntaxNode.prototype.isSwitchClause = function () {
        return false;
    };
    SyntaxNode.prototype.structuralEquals = function (node) {
        if(this === node) {
            return true;
        }
        if(node === null) {
            return false;
        }
        if(this.kind() !== node.kind()) {
            return false;
        }
        for(var i = 0, n = this.childCount(); i < n; i++) {
            var element1 = this.childAt(i);
            var element2 = node.childAt(i);
            if(!Syntax.elementStructuralEquals(element1, element2)) {
                return false;
            }
        }
        return true;
    };
    SyntaxNode.prototype.width = function () {
        return this.fullWidth() - this.leadingTriviaWidth() - this.trailingTriviaWidth();
    };
    SyntaxNode.prototype.leadingTriviaWidth = function () {
        var firstToken = this.firstToken();
        return firstToken === null ? 0 : firstToken.leadingTriviaWidth();
    };
    SyntaxNode.prototype.trailingTriviaWidth = function () {
        var lastToken = this.lastToken();
        return lastToken === null ? 0 : lastToken.trailingTriviaWidth();
    };
    return SyntaxNode;
})();
var PrettyPrinter;
(function (PrettyPrinter) {
    function prettyPrint(node, indentWhitespace) {
        if (typeof indentWhitespace === "undefined") { indentWhitespace = "    "; }
        var impl = new PrettyPrinterImpl(indentWhitespace);
        node.accept(impl);
        return impl.result.join("");
    }
    PrettyPrinter.prettyPrint = prettyPrint;
    var PrettyPrinterImpl = (function () {
        function PrettyPrinterImpl(indentWhitespace) {
            this.indentWhitespace = indentWhitespace;
            this.result = [];
            this.indentations = [];
            this.indentation = 0;
        }
        PrettyPrinterImpl.prototype.newLineCountBetweenModuleElements = function (element1, element2) {
            if(element1 === null || element2 === null) {
                return 0;
            }
            if(element1.lastToken().kind() === 71 /* CloseBraceToken */ ) {
                return 2;
            }
            return 1;
        };
        PrettyPrinterImpl.prototype.newLineCountBetweenClassElements = function (element1, element2) {
            if(element1 === null || element2 === null) {
                return 0;
            }
            return 1;
        };
        PrettyPrinterImpl.prototype.newLineCountBetweenStatements = function (element1, element2) {
            if(element1 === null || element2 === null) {
                return 0;
            }
            if(element1.lastToken().kind() === 71 /* CloseBraceToken */ ) {
                return 2;
            }
            return 1;
        };
        PrettyPrinterImpl.prototype.newLineCountBetweenSwitchClauses = function (element1, element2) {
            if(element1 === null || element2 === null) {
                return 0;
            }
            if(element1.statements.childCount() === 0) {
                return 1;
            }
            return 2;
        };
        PrettyPrinterImpl.prototype.ensureSpace = function () {
            if(this.result.length > 0) {
                var last = ArrayUtilities.last(this.result);
                if(last !== " " && last !== "\r\n") {
                    this.appendText(" ");
                }
            }
        };
        PrettyPrinterImpl.prototype.ensureNewLine = function () {
            if(this.result.length > 0) {
                var last = ArrayUtilities.last(this.result);
                if(last !== "\r\n") {
                    this.appendText("\r\n");
                }
            }
        };
        PrettyPrinterImpl.prototype.appendNewLines = function (count) {
            for(var i = 0; i < count; i++) {
                this.appendText("\r\n");
            }
        };
        PrettyPrinterImpl.prototype.getIndentation = function (count) {
            for(var i = this.indentations.length; i <= count; i++) {
                var text = i === 0 ? "" : this.indentations[i - 1] + this.indentWhitespace;
                this.indentations[i] = text;
            }
            return this.indentations[count];
        };
        PrettyPrinterImpl.prototype.appendIndentationIfAfterNewLine = function () {
            if(this.result.length > 0) {
                if(ArrayUtilities.last(this.result) === "\r\n") {
                    this.result.push(this.getIndentation(this.indentation));
                }
            }
        };
        PrettyPrinterImpl.prototype.appendText = function (text) {
            this.result.push(text);
        };
        PrettyPrinterImpl.prototype.appendNode = function (node) {
            if(node !== null) {
                node.accept(this);
            }
        };
        PrettyPrinterImpl.prototype.appendToken = function (token) {
            if(token !== null && token.fullWidth() > 0) {
                this.appendIndentationIfAfterNewLine();
                this.appendText(token.text());
            }
        };
        PrettyPrinterImpl.prototype.visitToken = function (token) {
            this.appendToken(token);
        };
        PrettyPrinterImpl.prototype.appendSeparatorSpaceList = function (list) {
            for(var i = 0, n = list.childCount(); i < n; i++) {
                if(i % 2 === 0) {
                    if(i > 0) {
                        this.ensureSpace();
                    }
                    list.childAt(i).accept(this);
                } else {
                    this.appendToken(list.childAt(i));
                }
            }
        };
        PrettyPrinterImpl.prototype.appendSeparatorNewLineList = function (list) {
            for(var i = 0, n = list.childCount(); i < n; i++) {
                if(i % 2 === 0) {
                    if(i > 0) {
                        this.ensureNewLine();
                    }
                    list.childAt(i).accept(this);
                } else {
                    this.appendToken(list.childAt(i));
                }
            }
        };
        PrettyPrinterImpl.prototype.appendModuleElements = function (list) {
            var lastModuleElement = null;
            for(var i = 0, n = list.childCount(); i < n; i++) {
                var moduleElement = list.childAt(i);
                var newLineCount = this.newLineCountBetweenModuleElements(lastModuleElement, moduleElement);
                this.appendNewLines(newLineCount);
                moduleElement.accept(this);
                lastModuleElement = moduleElement;
            }
        };
        PrettyPrinterImpl.prototype.visitSourceUnit = function (node) {
            this.appendModuleElements(node.moduleElements);
        };
        PrettyPrinterImpl.prototype.visitExternalModuleReference = function (node) {
            this.appendToken(node.moduleKeyword);
            this.appendToken(node.openParenToken);
            this.appendToken(node.stringLiteral);
            this.appendToken(node.closeParenToken);
        };
        PrettyPrinterImpl.prototype.visitModuleNameModuleReference = function (node) {
            node.moduleName.accept(this);
        };
        PrettyPrinterImpl.prototype.visitImportDeclaration = function (node) {
            this.appendToken(node.importKeyword);
            this.ensureSpace();
            this.appendToken(node.equalsToken);
            this.ensureSpace();
            node.moduleReference.accept(this);
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitClassDeclaration = function (node) {
            this.appendToken(node.exportKeyword);
            this.ensureSpace();
            this.appendToken(node.declareKeyword);
            this.ensureSpace();
            this.appendToken(node.classKeyword);
            this.ensureSpace();
            this.appendToken(node.identifier);
            this.appendNode(node.typeParameterList);
            this.ensureSpace();
            this.appendNode(node.extendsClause);
            this.ensureSpace();
            this.appendNode(node.implementsClause);
            this.ensureSpace();
            this.appendToken(node.openBraceToken);
            this.ensureNewLine();
            this.indentation++;
            var lastClassElement = null;
            for(var i = 0, n = node.classElements.childCount(); i < n; i++) {
                var classElement = node.classElements.childAt(i);
                var newLineCount = this.newLineCountBetweenClassElements(lastClassElement, classElement);
                this.appendNewLines(newLineCount);
                classElement.accept(this);
                lastClassElement = classElement;
            }
            this.indentation--;
            this.ensureNewLine();
            this.appendToken(node.closeBraceToken);
        };
        PrettyPrinterImpl.prototype.visitInterfaceDeclaration = function (node) {
            this.appendToken(node.exportKeyword);
            this.ensureSpace();
            this.appendToken(node.interfaceKeyword);
            this.ensureSpace();
            this.appendToken(node.identifier);
            this.appendNode(node.typeParameterList);
            this.ensureSpace();
            this.appendObjectType(node.body, true);
        };
        PrettyPrinterImpl.prototype.appendObjectType = function (node, appendNewLines) {
            this.appendToken(node.openBraceToken);
            if(appendNewLines) {
                this.ensureNewLine();
                this.indentation++;
            } else {
                this.ensureSpace();
            }
            for(var i = 0, n = node.typeMembers.childCount(); i < n; i++) {
                node.typeMembers.childAt(i).accept(this);
                if(appendNewLines) {
                    this.ensureNewLine();
                } else {
                    this.ensureSpace();
                }
            }
            this.indentation--;
            this.appendToken(node.closeBraceToken);
        };
        PrettyPrinterImpl.prototype.visitExtendsClause = function (node) {
            this.appendToken(node.extendsKeyword);
            this.ensureSpace();
            this.appendSeparatorSpaceList(node.typeNames);
        };
        PrettyPrinterImpl.prototype.visitImplementsClause = function (node) {
            this.appendToken(node.implementsKeyword);
            this.ensureSpace();
            this.appendSeparatorSpaceList(node.typeNames);
        };
        PrettyPrinterImpl.prototype.visitModuleDeclaration = function (node) {
            this.appendToken(node.exportKeyword);
            this.ensureSpace();
            this.appendToken(node.moduleKeyword);
            this.ensureSpace();
            this.appendNode(node.moduleName);
            this.ensureSpace();
            this.appendToken(node.stringLiteral);
            this.ensureSpace();
            this.appendToken(node.openBraceToken);
            this.ensureNewLine();
            this.indentation++;
            this.appendModuleElements(node.moduleElements);
            this.indentation--;
            this.appendToken(node.closeBraceToken);
        };
        PrettyPrinterImpl.prototype.appendBlockOrSemicolon = function (block, semicolonToken) {
            if(block) {
                this.ensureSpace();
                block.accept(this);
            } else {
                this.appendToken(semicolonToken);
            }
        };
        PrettyPrinterImpl.prototype.visitFunctionDeclaration = function (node) {
            this.appendToken(node.exportKeyword);
            this.ensureSpace();
            this.appendToken(node.functionKeyword);
            this.ensureSpace();
            this.appendNode(node.functionSignature);
            this.appendBlockOrSemicolon(node.block, node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitVariableStatement = function (node) {
            this.appendToken(node.exportKeyword);
            this.ensureSpace();
            this.appendToken(node.declareKeyword);
            this.ensureSpace();
            node.variableDeclaration.accept(this);
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitVariableDeclaration = function (node) {
            this.appendToken(node.varKeyword);
            this.ensureSpace();
            this.appendSeparatorSpaceList(node.variableDeclarators);
        };
        PrettyPrinterImpl.prototype.visitVariableDeclarator = function (node) {
            this.appendToken(node.identifier);
            this.appendNode(node.equalsValueClause);
        };
        PrettyPrinterImpl.prototype.visitEqualsValueClause = function (node) {
            this.ensureSpace();
            this.appendToken(node.equalsToken);
            this.ensureSpace();
            node.value.accept(this);
        };
        PrettyPrinterImpl.prototype.visitPrefixUnaryExpression = function (node) {
            this.appendToken(node.operatorToken);
            node.operand.accept(this);
        };
        PrettyPrinterImpl.prototype.visitArrayLiteralExpression = function (node) {
            this.appendToken(node.openBracketToken);
            this.appendSeparatorSpaceList(node.expressions);
            this.appendToken(node.closeBracketToken);
        };
        PrettyPrinterImpl.prototype.visitOmittedExpression = function (node) {
        };
        PrettyPrinterImpl.prototype.visitParenthesizedExpression = function (node) {
            this.appendToken(node.openParenToken);
            node.expression.accept(this);
            this.appendToken(node.closeParenToken);
        };
        PrettyPrinterImpl.prototype.visitSimpleArrowFunctionExpression = function (node) {
            this.appendToken(node.identifier);
            this.ensureSpace();
            this.appendToken(node.equalsGreaterThanToken);
            this.ensureSpace();
            node.body.accept(this);
        };
        PrettyPrinterImpl.prototype.visitParenthesizedArrowFunctionExpression = function (node) {
            node.callSignature.accept(this);
            this.ensureSpace();
            this.appendToken(node.equalsGreaterThanToken);
            this.ensureSpace();
            node.body.accept(this);
        };
        PrettyPrinterImpl.prototype.visitQualifiedName = function (node) {
            node.left.accept(this);
            this.appendToken(node.dotToken);
            this.appendToken(node.right);
        };
        PrettyPrinterImpl.prototype.visitTypeArgumentList = function (node) {
            this.appendToken(node.lessThanToken);
            this.appendSeparatorSpaceList(node.typeArguments);
            this.appendToken(node.greaterThanToken);
        };
        PrettyPrinterImpl.prototype.visitConstructorType = function (node) {
            this.appendToken(node.newKeyword);
            this.ensureSpace();
            this.appendNode(node.typeParameterList);
            node.parameterList.accept(this);
            this.ensureSpace();
            this.appendToken(node.equalsGreaterThanToken);
            this.ensureSpace();
            node.type.accept(this);
        };
        PrettyPrinterImpl.prototype.visitFunctionType = function (node) {
            this.appendNode(node.typeParameterList);
            node.parameterList.accept(this);
            this.ensureSpace();
            this.appendToken(node.equalsGreaterThanToken);
            this.ensureSpace();
            node.type.accept(this);
        };
        PrettyPrinterImpl.prototype.visitObjectType = function (node) {
            this.appendToken(node.openBraceToken);
            this.ensureSpace();
            this.appendSeparatorSpaceList(node.typeMembers);
            this.appendToken(node.closeBraceToken);
        };
        PrettyPrinterImpl.prototype.visitArrayType = function (node) {
            node.type.accept(this);
            this.appendToken(node.openBracketToken);
            this.appendToken(node.closeBracketToken);
        };
        PrettyPrinterImpl.prototype.visitGenericType = function (node) {
            node.name.accept(this);
            node.typeArgumentList.accept(this);
        };
        PrettyPrinterImpl.prototype.visitTypeAnnotation = function (node) {
            this.appendToken(node.colonToken);
            this.ensureSpace();
            node.type.accept(this);
        };
        PrettyPrinterImpl.prototype.appendStatements = function (statements) {
            var lastStatement = null;
            for(var i = 0, n = statements.childCount(); i < n; i++) {
                var statement = statements.childAt(i);
                var newLineCount = this.newLineCountBetweenStatements(lastStatement, statement);
                this.appendNewLines(newLineCount);
                statement.accept(this);
                lastStatement = statement;
            }
        };
        PrettyPrinterImpl.prototype.visitBlock = function (node) {
            this.appendToken(node.openBraceToken);
            this.ensureNewLine();
            this.indentation++;
            this.appendStatements(node.statements);
            this.indentation--;
            this.ensureNewLine();
            this.appendToken(node.closeBraceToken);
        };
        PrettyPrinterImpl.prototype.visitParameter = function (node) {
            this.appendToken(node.dotDotDotToken);
            this.appendToken(node.identifier);
            this.appendToken(node.questionToken);
            this.appendNode(node.typeAnnotation);
            this.appendNode(node.equalsValueClause);
        };
        PrettyPrinterImpl.prototype.visitMemberAccessExpression = function (node) {
            node.expression.accept(this);
            this.appendToken(node.dotToken);
            this.appendToken(node.name);
        };
        PrettyPrinterImpl.prototype.visitPostfixUnaryExpression = function (node) {
            node.operand.accept(this);
            this.appendToken(node.operatorToken);
        };
        PrettyPrinterImpl.prototype.visitElementAccessExpression = function (node) {
            node.expression.accept(this);
            this.appendToken(node.openBracketToken);
            node.argumentExpression.accept(this);
            this.appendToken(node.closeBracketToken);
        };
        PrettyPrinterImpl.prototype.visitInvocationExpression = function (node) {
            node.expression.accept(this);
            node.argumentList.accept(this);
        };
        PrettyPrinterImpl.prototype.visitArgumentList = function (node) {
            this.appendToken(node.openParenToken);
            this.appendSeparatorSpaceList(node.arguments);
            this.appendToken(node.closeParenToken);
        };
        PrettyPrinterImpl.prototype.visitBinaryExpression = function (node) {
            node.left.accept(this);
            if(node.kind() !== 170 /* CommaExpression */ ) {
                this.ensureSpace();
            }
            this.appendToken(node.operatorToken);
            this.ensureSpace();
            node.right.accept(this);
        };
        PrettyPrinterImpl.prototype.visitConditionalExpression = function (node) {
            node.condition.accept(this);
            this.ensureSpace();
            this.appendToken(node.questionToken);
            this.ensureSpace();
            node.whenTrue.accept(this);
            this.ensureSpace();
            this.appendToken(node.colonToken);
            this.ensureSpace();
            node.whenFalse.accept(this);
        };
        PrettyPrinterImpl.prototype.visitConstructSignature = function (node) {
            this.appendToken(node.newKeyword);
            node.callSignature.accept(this);
        };
        PrettyPrinterImpl.prototype.visitFunctionSignature = function (node) {
            this.appendToken(node.identifier);
            this.appendToken(node.questionToken);
            node.callSignature.accept(this);
        };
        PrettyPrinterImpl.prototype.visitIndexSignature = function (node) {
            this.appendToken(node.openBracketToken);
            node.parameter.accept(this);
            this.appendToken(node.closeBracketToken);
            this.appendNode(node.typeAnnotation);
        };
        PrettyPrinterImpl.prototype.visitPropertySignature = function (node) {
            this.appendToken(node.identifier);
            this.appendToken(node.questionToken);
            this.appendNode(node.typeAnnotation);
        };
        PrettyPrinterImpl.prototype.visitParameterList = function (node) {
            this.appendToken(node.openParenToken);
            this.appendSeparatorSpaceList(node.parameters);
            this.appendToken(node.closeParenToken);
        };
        PrettyPrinterImpl.prototype.visitCallSignature = function (node) {
            this.appendNode(node.typeParameterList);
            node.parameterList.accept(this);
            this.appendNode(node.typeAnnotation);
        };
        PrettyPrinterImpl.prototype.visitTypeParameterList = function (node) {
            this.appendToken(node.lessThanToken);
            this.appendSeparatorSpaceList(node.typeParameters);
            this.appendToken(node.greaterThanToken);
        };
        PrettyPrinterImpl.prototype.visitTypeParameter = function (node) {
            this.appendToken(node.identifier);
            this.appendNode(node.constraint);
        };
        PrettyPrinterImpl.prototype.visitConstraint = function (node) {
            this.ensureSpace();
            this.appendToken(node.extendsKeyword);
            this.ensureSpace();
            node.type.accept(this);
        };
        PrettyPrinterImpl.prototype.appendBlockOrStatement = function (node) {
            if(node.kind() === 143 /* Block */ ) {
                this.ensureSpace();
                node.accept(this);
            } else {
                this.ensureNewLine();
                this.indentation++;
                node.accept(this);
                this.indentation--;
            }
        };
        PrettyPrinterImpl.prototype.visitIfStatement = function (node) {
            this.appendToken(node.ifKeyword);
            this.ensureSpace();
            this.appendToken(node.openParenToken);
            node.condition.accept(this);
            this.appendToken(node.closeParenToken);
            this.appendBlockOrStatement(node.statement);
            this.appendNode(node.elseClause);
        };
        PrettyPrinterImpl.prototype.visitElseClause = function (node) {
            this.ensureNewLine();
            this.appendToken(node.elseKeyword);
            if(node.statement.kind() === 144 /* IfStatement */ ) {
                this.ensureSpace();
                node.statement.accept(this);
            } else {
                this.appendBlockOrStatement(node.statement);
            }
        };
        PrettyPrinterImpl.prototype.visitExpressionStatement = function (node) {
            node.expression.accept(this);
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitConstructorDeclaration = function (node) {
            this.appendToken(node.constructorKeyword);
            node.parameterList.accept(this);
            this.appendBlockOrSemicolon(node.block, node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitMemberFunctionDeclaration = function (node) {
            this.appendToken(node.publicOrPrivateKeyword);
            this.ensureSpace();
            this.appendToken(node.staticKeyword);
            this.ensureSpace();
            node.functionSignature.accept(this);
            this.appendBlockOrSemicolon(node.block, node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitGetMemberAccessorDeclaration = function (node) {
            this.appendToken(node.publicOrPrivateKeyword);
            this.ensureSpace();
            this.appendToken(node.staticKeyword);
            this.ensureSpace();
            this.appendToken(node.getKeyword);
            this.ensureSpace();
            this.appendToken(node.identifier);
            node.parameterList.accept(this);
            this.appendNode(node.typeAnnotation);
            this.ensureSpace();
            node.block.accept(this);
        };
        PrettyPrinterImpl.prototype.visitSetMemberAccessorDeclaration = function (node) {
            this.appendToken(node.publicOrPrivateKeyword);
            this.ensureSpace();
            this.appendToken(node.staticKeyword);
            this.ensureSpace();
            this.appendToken(node.setKeyword);
            this.ensureSpace();
            this.appendToken(node.identifier);
            node.parameterList.accept(this);
            this.ensureSpace();
            node.block.accept(this);
        };
        PrettyPrinterImpl.prototype.visitMemberVariableDeclaration = function (node) {
            this.appendToken(node.publicOrPrivateKeyword);
            this.ensureSpace();
            this.appendToken(node.staticKeyword);
            this.ensureSpace();
            node.variableDeclarator.accept(this);
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitThrowStatement = function (node) {
            this.appendToken(node.throwKeyword);
            if(node.expression) {
                this.ensureSpace();
                node.expression.accept(this);
            }
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitReturnStatement = function (node) {
            this.appendToken(node.returnKeyword);
            if(node.expression) {
                this.ensureSpace();
                node.expression.accept(this);
            }
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitObjectCreationExpression = function (node) {
            this.appendToken(node.newKeyword);
            this.ensureSpace();
            node.expression.accept(this);
            this.appendNode(node.argumentList);
        };
        PrettyPrinterImpl.prototype.visitSwitchStatement = function (node) {
            this.appendToken(node.switchKeyword);
            this.ensureSpace();
            this.appendToken(node.openParenToken);
            node.expression.accept(this);
            this.appendToken(node.closeParenToken);
            this.ensureSpace();
            this.appendToken(node.openBraceToken);
            this.ensureNewLine();
            var lastSwitchClause = null;
            for(var i = 0, n = node.switchClauses.childCount(); i < n; i++) {
                var switchClause = node.switchClauses.childAt(i);
                var newLineCount = this.newLineCountBetweenSwitchClauses(lastSwitchClause, switchClause);
                this.appendNewLines(newLineCount);
                switchClause.accept(this);
                lastSwitchClause = switchClause;
            }
            this.ensureNewLine();
            this.appendToken(node.closeBraceToken);
        };
        PrettyPrinterImpl.prototype.appendSwitchClauseStatements = function (node) {
            if(node.statements.childCount() === 1 && node.statements.childAt(0).kind() === 143 /* Block */ ) {
                this.ensureSpace();
                node.statements.childAt(0).accept(this);
            } else if(node.statements.childCount() > 0) {
                this.ensureNewLine();
                this.indentation++;
                this.appendStatements(node.statements);
                this.indentation--;
            }
        };
        PrettyPrinterImpl.prototype.visitCaseSwitchClause = function (node) {
            this.appendToken(node.caseKeyword);
            this.ensureSpace();
            node.expression.accept(this);
            this.appendToken(node.colonToken);
            this.appendSwitchClauseStatements(node);
        };
        PrettyPrinterImpl.prototype.visitDefaultSwitchClause = function (node) {
            this.appendToken(node.defaultKeyword);
            this.appendToken(node.colonToken);
            this.appendSwitchClauseStatements(node);
        };
        PrettyPrinterImpl.prototype.visitBreakStatement = function (node) {
            this.appendToken(node.breakKeyword);
            if(node.identifier) {
                this.ensureSpace();
                this.appendToken(node.identifier);
            }
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitContinueStatement = function (node) {
            this.appendToken(node.continueKeyword);
            if(node.identifier) {
                this.ensureSpace();
                this.appendToken(node.identifier);
            }
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitForStatement = function (node) {
            this.appendToken(node.forKeyword);
            this.ensureSpace();
            this.appendToken(node.openParenToken);
            this.appendNode(node.variableDeclaration);
            this.appendNode(node.initializer);
            this.appendToken(node.firstSemicolonToken);
            if(node.condition) {
                this.ensureSpace();
                node.condition.accept(this);
            }
            this.appendToken(node.secondSemicolonToken);
            if(node.incrementor) {
                this.ensureSpace();
                node.incrementor.accept(this);
            }
            this.appendToken(node.closeParenToken);
            this.appendBlockOrStatement(node.statement);
        };
        PrettyPrinterImpl.prototype.visitForInStatement = function (node) {
            this.appendToken(node.forKeyword);
            this.ensureSpace();
            this.appendToken(node.openParenToken);
            this.appendNode(node.variableDeclaration);
            this.appendNode(node.left);
            this.ensureSpace();
            this.appendToken(node.inKeyword);
            this.ensureSpace();
            this.appendNode(node.expression);
            this.appendToken(node.closeParenToken);
            this.appendBlockOrStatement(node.statement);
        };
        PrettyPrinterImpl.prototype.visitWhileStatement = function (node) {
            this.appendToken(node.whileKeyword);
            this.ensureSpace();
            this.appendToken(node.openParenToken);
            node.condition.accept(this);
            this.appendToken(node.closeParenToken);
            this.appendBlockOrStatement(node.statement);
        };
        PrettyPrinterImpl.prototype.visitWithStatement = function (node) {
            this.appendToken(node.withKeyword);
            this.ensureSpace();
            this.appendToken(node.openParenToken);
            node.condition.accept(this);
            this.appendToken(node.closeParenToken);
            this.appendBlockOrStatement(node.statement);
        };
        PrettyPrinterImpl.prototype.visitEnumDeclaration = function (node) {
            this.appendToken(node.exportKeyword);
            this.ensureSpace();
            this.appendToken(node.enumKeyword);
            this.ensureSpace();
            this.appendToken(node.identifier);
            this.ensureSpace();
            this.appendToken(node.openBraceToken);
            this.ensureNewLine();
            this.indentation++;
            this.appendSeparatorNewLineList(node.variableDeclarators);
            this.indentation--;
            this.appendToken(node.closeBraceToken);
        };
        PrettyPrinterImpl.prototype.visitCastExpression = function (node) {
            this.appendToken(node.lessThanToken);
            node.type.accept(this);
            this.appendToken(node.greaterThanToken);
            node.expression.accept(this);
        };
        PrettyPrinterImpl.prototype.visitObjectLiteralExpression = function (node) {
            this.appendToken(node.openBraceToken);
            if(node.propertyAssignments.childCount() === 1) {
                this.ensureSpace();
                node.propertyAssignments.childAt(0).accept(this);
                this.ensureSpace();
            } else if(node.propertyAssignments.childCount() > 0) {
                this.indentation++;
                this.ensureNewLine();
                this.appendSeparatorNewLineList(node.propertyAssignments);
                this.ensureNewLine();
                this.indentation--;
            }
            this.appendToken(node.closeBraceToken);
        };
        PrettyPrinterImpl.prototype.visitSimplePropertyAssignment = function (node) {
            this.appendToken(node.propertyName);
            this.appendToken(node.colonToken);
            this.ensureSpace();
            node.expression.accept(this);
        };
        PrettyPrinterImpl.prototype.visitGetAccessorPropertyAssignment = function (node) {
            this.appendToken(node.getKeyword);
            this.ensureSpace();
            this.appendToken(node.propertyName);
            this.appendToken(node.openParenToken);
            this.appendToken(node.closeParenToken);
            this.ensureSpace();
            node.block.accept(this);
        };
        PrettyPrinterImpl.prototype.visitSetAccessorPropertyAssignment = function (node) {
            this.appendToken(node.setKeyword);
            this.ensureSpace();
            this.appendToken(node.propertyName);
            this.appendToken(node.openParenToken);
            this.appendToken(node.parameterName);
            this.appendToken(node.closeParenToken);
            this.ensureSpace();
            node.block.accept(this);
        };
        PrettyPrinterImpl.prototype.visitFunctionExpression = function (node) {
            this.appendToken(node.functionKeyword);
            if(node.identifier) {
                this.ensureSpace();
                this.appendToken(node.identifier);
            }
            node.callSignature.accept(this);
            this.ensureSpace();
            node.block.accept(this);
        };
        PrettyPrinterImpl.prototype.visitEmptyStatement = function (node) {
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitTryStatement = function (node) {
            this.appendToken(node.tryKeyword);
            this.ensureSpace();
            node.block.accept(this);
            this.appendNode(node.catchClause);
            this.appendNode(node.finallyClause);
        };
        PrettyPrinterImpl.prototype.visitCatchClause = function (node) {
            this.ensureNewLine();
            this.appendToken(node.catchKeyword);
            this.ensureSpace();
            this.appendToken(node.openParenToken);
            this.appendToken(node.identifier);
            this.appendToken(node.closeParenToken);
            this.ensureSpace();
            node.block.accept(this);
        };
        PrettyPrinterImpl.prototype.visitFinallyClause = function (node) {
            this.ensureNewLine();
            this.appendToken(node.finallyKeyword);
            this.ensureNewLine();
            node.block.accept(this);
        };
        PrettyPrinterImpl.prototype.visitLabeledStatement = function (node) {
            this.appendToken(node.identifier);
            this.appendToken(node.colonToken);
            this.appendBlockOrStatement(node.statement);
        };
        PrettyPrinterImpl.prototype.visitDoStatement = function (node) {
            this.appendToken(node.doKeyword);
            this.appendBlockOrStatement(node.statement);
            this.ensureNewLine();
            this.appendToken(node.whileKeyword);
            this.ensureSpace();
            this.appendToken(node.openParenToken);
            node.condition.accept(this);
            this.appendToken(node.closeParenToken);
            this.appendToken(node.semicolonToken);
        };
        PrettyPrinterImpl.prototype.visitTypeOfExpression = function (node) {
            this.appendToken(node.typeOfKeyword);
            this.ensureSpace();
            node.expression.accept(this);
        };
        PrettyPrinterImpl.prototype.visitDeleteExpression = function (node) {
            this.appendToken(node.deleteKeyword);
            this.ensureSpace();
            node.expression.accept(this);
        };
        PrettyPrinterImpl.prototype.visitVoidExpression = function (node) {
            this.appendToken(node.voidKeyword);
            this.ensureSpace();
            node.expression.accept(this);
        };
        PrettyPrinterImpl.prototype.visitDebuggerStatement = function (node) {
            this.appendToken(node.debuggerKeyword);
            this.appendToken(node.semicolonToken);
        };
        return PrettyPrinterImpl;
    })();    
})(PrettyPrinter || (PrettyPrinter = {}));
