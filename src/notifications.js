















function checkAlarmsAndNotify() {
    const permission = localStorage.getItem(LS_PERMISSION_KEY) || null;
    
    if (ALARMS_STORE.length) {
        const toBeNotified = ALARMS_STORE.filter(({ notified }) => !notified)

        toBeNotified.forEach(alarm => {
            const { id, date, time, name } = alarm;

            const parsedDate = Date.parse(`${date} ${time}`); // returns date in millisecs
            const dateNow = Date.now();

            const img = '/img/icon-alarm-clock-96.png';
            const text = `Hey! Your alarm ${name} is now overdue.`;

            if (dateNow > parsedDate) {
                ALARMS_STORE = ALARMS_STORE.map(alarm => {
                    if (alarm.id === id) alarm.notified = true;
                    return alarm;
                });

                if (permission !== null && permission) {
                    const notification = new Notification('My Alarms App', { body: text, icon: img });
                }
            }
        });

        saveAndRender();
    }
}

window.onload = () => {
    renderAlarms();
    showHideEnableBtn();
    setInterval(() => {
        checkAlarmsAndNotify();
    }, 3000);
}