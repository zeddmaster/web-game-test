document.addEventListener('DOMContentLoaded', function() {

	// show test windows
    window.addEventListener('scroll', (e) => {
        requestAnimationFrame(() => {
            const elements = [... document.querySelectorAll('section.test-form.hidden')]

            for(const elem of elements){
                if(window.scrollX + window.innerWidth * .6 >= elem.offsetLeft)
                    elem.classList.remove('hidden');
            }
        })
    })

    // buttons
    const buttons = document.querySelectorAll('button')
    const messages = [
        'Кнопки не работают, можешь не пытаться',
        'Я ж говорю, не работают)',
        'Dear user, the buttons do not work ⚠',
        'Ну перестань, прекрати это делать',
        'Доиграешься',
        '...',
        '',
        '',
        '',
        '',
        'Ну не работают кнопки емаЁ!',
        'звоню в дурку...',
        'за тобой уже выехали',
        '😡😤😤',
        'все, никаких больше кнопок',
    ];

    for(const btn of buttons) {
        btn.addEventListener('click', (e) => {

            const i = +localStorage.getItem('btnMsgIndex') || 0

            alert(messages[i])

            if(messages[i + 1] === undefined){
                for(const btn of buttons){
                    btn.style.display = 'none';
                }
                return;
            }

            localStorage.setItem('btnMsgIndex', `${i+1}`)
        })
    }

});