import * as React from 'react'; // quotemark failure

interface IFooProps extends React.Props<FooComponent> {
    //
}

interface IFooState {
    bar:string[] // whitespace failure
}

export class FooComponent extends React.Component<IFooProps, IFooState> {
    public state = {
        bar: [] as string[]
    }

    public render() {
        return (
            <div>
                {this.state.bar.map((s) => <span>{s}</span>)}
            </div>
        );
	} // indent failure
}
