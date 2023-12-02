import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./tic-tac-toe/TicTacToe.css";
import TicTacToeGame from "./tic-tac-toe/TicTacToe";
import ThinkingInReact from "./thinking-in-react/ThinkingInReact";
import { useState } from "react";

const TabView: React.FC<{}> = () => {
    const [activeTab, setActiveTab] = useState<number>(0);

    return (
        <div>
            <div className={"Tab-Bar"}>
                <button onClick={() => setActiveTab(0)}>Tab 1</button>
                <button onClick={() => setActiveTab(1)}>Tab 2</button>
                <button onClick={() => setActiveTab(2)}>Tab 3</button>
            </div>
            <div>
                {activeTab === 0 && <TicTacToeGame />}
                {activeTab === 1 && <ThinkingInReact />}
                {activeTab === 2 && <div>Tab 3 content</div>}
            </div>
        </div>
    );
};

export default function App() {
    return <TabView />;
}
