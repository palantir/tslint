import * as React from 'react'; // quotemark failure

class BazComponent extends React.Component<React.Props<BazComponent>, {}> {
    public render() {
        return (
            <div></div>
        );
    }
}

interface IFooProps extends React.Props<FooComponent> {
    fooProp: string;
}

interface IFooState {
    bar:string[]; // whitespace failure
}

export class FooComponent extends React.Component<IFooProps, IFooState> {
    public state = {
        bar: [] as string[]
    };

    public render() {
        return (
            <div onClick={() => this.onClick()}>
                {this.state.bar.map((s) => <span>{s}</span>)}
                <BazComponent someProp={123} anotherProp={456} />
            </div>
        );
	} // indent failure

    private onClick() {
        console.info("foo component clicked");
    }
}

export function buildFooComponent(): JSX.Element {
    let x: string = "test";
    return <FooComponent fooProp={ x } />;
}
