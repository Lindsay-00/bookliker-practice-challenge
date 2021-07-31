document.addEventListener("DOMContentLoaded", function() {
    getBookData()
})

const currUser = {
    'id': 1,
    'username': "pouros"
}

function renderOneBook(book){
    const ul = document.querySelector('#list')
    const li = document.createElement('li')
    li.classList.add('book')
    li.dataset.id = book.id
    li.innerText = book.title
    ul.append(li)

    li.addEventListener('click', () => {
        const show = document.querySelector('#show-panel')
        const outerDiv = document.createElement('div')
        show.innerHTML = ""
        outerDiv.classList.add('show-book')
        outerDiv.dataset.id = book.id
        show.append(outerDiv)

        outerDiv.innerHTML = `
        <div class="img-container">
            <img src="${book.img_url}"
                alt="${book.title}" />
            <div class="article-title-container">
                <h4>${book.title}</h4>
            </div>
        </div>
        <h4 class='subtitle'>${book.subtitle}</h4>
        <h4 class='author'>${book.author}</h4>
        <p class='description'>${book.description}</p>
        <ul class='users' data-id='${book.id}'></ul>
        `

        // users
       
        book.users.forEach(user => {
            const userLi = document.createElement('li')
            userLi.classList.add(`${user.username}`)
            userLi.dataset.id = user.id
            userLi.innerText = user["username"]

            const userUl = document.querySelector(`ul.users[data-id='${book.id}']`)
            userUl.append(userLi)
        })

        // like button

        const btn = document.createElement('button')
        btn.classList.add('like-button')
        const nameArr = book.users.map((user) => user.username)

        if(nameArr.some(name => name === currUser.username)){
            btn.innerText = "UNLIKE"
        }
        else{
            btn.innerText = "LIKE"
        }
        
        outerDiv.append(btn)  
        
        // add click event to like btn


        btn.addEventListener('click', () => {


            if(btn.innerText === 'LIKE'){

                const currLi = document.createElement('li')
                currLi.classList.add(`${currUser.username}`)
                currLi.dataset.id = currUser.id
                currLi.innerText = currUser.username

                // currUl.append(currLi)
                const userUl = document.querySelector(`ul.users[data-id='${book.id}']`)
                userUl.append(currLi)

                btn.innerText = "UNLIKE"

                // add persistence
                
                book.users.push(currUser)
                const newUsers = book.users

                fetch(`http://localhost:3000/books/${book.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ users: newUsers })
                })
                .then(r => r.json())
                
            }
            else{
  
                const userRemove = document.querySelector(`.${currUser.username}`)
                userRemove.remove()

                btn.innerText = "LIKE"

            
                const newUsers = book.users.filter(user => user["username"] != currUser.username)

                fetch(`http://localhost:3000/books/${book.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ users: newUsers })
                })
                    .then(r => r.json())
                    
            }
        })
    })

}

function getBookData(){
    fetch(' http://localhost:3000/books')
        .then(r => r.json())
        .then(bookArray => {
        bookArray.forEach(bookObj => {
            renderOneBook(bookObj)
        })
    })
}


