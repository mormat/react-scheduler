
function Message({ children, type }) {
    
    return (
        <p  className = "mormat-scheduler-Widget-Message"
            data-type = { type }
        >
            { children }
        </p>
    )
    
}

export default Message