import Scheduler from "@mormat/react-scheduler";

function App() {
    
    const config = {
        initialDate: "2024-01-26",
        events: [
            {
                start: new Date("2024-01-26 10:00Z"),
                end:   new Date("2024-01-26 12:00Z"),
                label: "some event",
            }
        ]
    }
    
    return <Scheduler { ...config } />;
    
}

export default App;