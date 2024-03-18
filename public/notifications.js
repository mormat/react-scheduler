
function notify(message) {
    var previousValue = window.notifications || '';

    window.notifications = previousValue + message;
};
