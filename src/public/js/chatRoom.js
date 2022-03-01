$(function() {
    var socket = io()
    socket.emit('Enter Room', $('#roomName').val())
    
    $('form').on('submit', function(e) {
        e.preventDefault()
        socket.emit('Chat', {
            msg: $('#m').val()
        })
        $('#m').val('')
        setTimeout(() => {
            document.querySelector('#messages').scrollTo(0, 1000000000000)    
        }, 200)
        return false
    })
    socket.on('Chat', function(chatie){
        $('#messages').append($('<li>').text(chatie.userName + ": " + chatie.msg))
        controlScroll()
    })
    socket.on('Update Members', function(members){
        document.querySelector('#members').innerHTML = ""
        for(let i=0; i<members.length; i++){
            $('#members').append($('<li>').text(members[i]))
        }
    })
})

function isScrollDown () {
    const scrollHeight = document.querySelector('#messages').scrollHeight
    const scrollTop = document.querySelector('#messages').scrollTop
    const offsetHeight = document.querySelector('#messages').offsetHeight
    const err = 70
    return ( scrollHeight - offsetHeight - err < scrollTop  )
}

function controlScroll () {
    if ( isScrollDown() ) {
        document.querySelector('#messages').scrollTo(0, 1000000000000)    
        console.log("yes")
    }
    else {
        console.log("no")
    }
}

function adjustChatList () {
    const parentHeight = document.querySelector('section').offsetHeight
    document.querySelector('#messages').setAttribute("style", `height: ${parentHeight-50}px`)
    console.log(parentHeight)
}

window.onload = adjustChatList
window.addEventListener('resize', adjustChatList)
