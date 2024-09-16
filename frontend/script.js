document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar')
    const monthYear = document.getElementById('month-year')
    const blueBtn = document.getElementById('blue-btn')
    const redBtn = document.getElementById('red-btn')
    const removeBtn = document.getElementById('remove-btn')
    const prevMonthBtn = document.getElementById('prev-month')
    const nextMonthBtn = document.getElementById('next-month')

    let selectedColor = ''
    let currentDate = new Date()
    const userId = 'user123'

    async function saveColorToDB(userId, date, color) {
        await fetch('http://localhost:3000/save-color', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, date, color })
        })
    }

    async function loadColorsFromDB(userId) {
        const response = await fetch(`http://localhost:3000/get-colors/${userId}`)
        const colors = await response.json()
        colors.forEach(({ date, color }) => {
            const dayElement = document.querySelector(`[data-date="${date}"]`)
            if (dayElement) {
                dayElement.classList.add(color)
            }
        })
    }

    loadColorsFromDB(userId)

    function updateCalendar() {
        calendar.innerHTML = ''
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay()

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ]

        monthYear.textContent = `${monthNames[month]} ${year}`

        for (let i = 0; i < firstDay; i++) {
            const emptyBox = document.createElement('div')
            emptyBox.className = 'day'
            calendar.appendChild(emptyBox)
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div')
            day.className = 'day'
            day.textContent = i

            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
            day.setAttribute('data-date', date)

            day.addEventListener('click', function() {
                day.className = 'day'
                if (selectedColor) {
                    day.classList.add(selectedColor)
                    saveColorToDB(userId, date, selectedColor)
                } else {
                    saveColorToDB(userId, date, '')
                }
            })

            calendar.appendChild(day)
        }
    }

    blueBtn.addEventListener('click', function() {
        selectedColor = 'blue'
    })

    redBtn.addEventListener('click', function() {
        selectedColor = 'red'
    })

    removeBtn.addEventListener('click', function() {
        selectedColor = ''
    })

    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1)
        updateCalendar()
    })

    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1)
        updateCalendar()
    })

    updateCalendar()
})
