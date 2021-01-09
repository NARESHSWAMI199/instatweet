function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const files = document.getElementById('image_file')
files.style.display = "none"



const tweet_error = document.getElementById('tweet_error')
function showError(message) {
    if (message) {
        tweet_error.setAttribute('class', 'd-block  text-center alert alert-danger')
        tweet_error.innerHTML = "<span> " + message + " </span>"
    }
    else {
        tweet_error.setAttribute('d-none')
    }
}

const modal = document.getElementById('exampleModal')
const tweet_create = document.getElementById('create_tweet')
tweet_create.addEventListener("submit", (event) => {
    event.preventDefault()
    const MyForm = event.target
    let MyFormData = new FormData(MyForm)
    const method = MyForm.getAttribute("method")
    const url = MyForm.getAttribute("action")
    const csrftoken = getCookie('csrftoken')
    const xhr = new XMLHttpRequest()
    xhr.responseType = "json"
    xhr.open(method, url)
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
    xhr.onload = function () {
        const SeverResponse = xhr.response
        tweet_create.reset()
        modal.style.display = "none"
        get_tweet()

    }
    xhr.send(MyFormData)
})





const tweet_container = document.getElementById("tweets")
function get_tweet() {
    const xhr = new XMLHttpRequest()
    const method = "GET"
    const url = "/tweet/"
    xhr.responseType = "json"
    xhr.open(method, url)
    xhr.onload = function () {
        const SeverResponse = xhr.response
        const tweets = SeverResponse
        let tweet = ""
        for (var i = 0; i < tweets.length; i++) {
            tweet += showTweet(tweets[i])
        }
        tweet_container.innerHTML = tweet
    }
    xhr.send()
}

function retweet_content(action, id) {
    // $("#retweet").modal()
    let retweet = prompt("enter your retweet .")
    // const textarea = document.getElementById('create_retweet')
    tweetAction(action, id, retweet)
}

function tweetAction(action, id, content) {
    const url = '/tweet/action/'
    const method = 'POST'
    const data = JSON.stringify({
        id: id,
        action: action,
        content: content
    })

    const csrftoken = getCookie('csrftoken')
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'json'
    xhr.open(method, url)
    // you must need set the header for content type 
    xhr.setRequestHeader('Content-Type', 'application/json')
    // xhr.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest')
    // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
    xhr.onload = function () {
        const ServerResponse = xhr.response
        if (xhr.status === 403) {
            showError("You can't perform any action you need login must")
            // alert("You can't perform any action you need login must")
        }
        if (xhr.status == 500) {
            showError("this is a server error")
            // alert("this is a server error")
        }
        get_tweet()
    }
    xhr.send(data)
}








function showTweet(tweet) {
    if (tweet.parent !== null && tweet.parent.image !== null) {
        return tweet_container.innerHTML = " <div class='shadow-sm border  p-5' >" +
            showProfiles(tweet.profile, tweet_container) +
            "<h6 class='mt-5'>" + tweet['content'] + "</h6> " +
            "<div class='bg-light m-4 shadow-sm p-5' >" +
            showProfiles(tweet.parent.profile, tweet_container) +
            "<p class='mt-5' >" + tweet.parent['content'] + " </p>" +
            "<img class='img-fluid'  heigth =500 width=500 src='" + tweet.parent["image"] + "' /><br>" +
            LikeButton(tweet.parent) + UnlikeButton(tweet.parent) + Retweet(tweet.parent) + comment_form(tweet.parent) + commentModel(tweet.parent) +
            "</div>" +
            LikeButton(tweet) + UnlikeButton(tweet) + Retweet(tweet) + comment_form(tweet) + commentModel(tweet) +
            " </div>"
    }

    else if (tweet.parent !== null) {
        return tweet_container.innerHTML = " <div class='shadow-sm p-5' >" +
            showProfiles(tweet.profile, tweet_container) +
            "<h6 class='mt-5'>" + tweet['content'] + "</h6> " +
            "<div class='bg-light m-4 shadow-sm p-5' >" +
            showProfiles(tweet.parent.profile, tweet_container) +
            "<p class='mt-5' >" + tweet.parent['content'] + " </p>" +
            LikeButton(tweet.parent) + UnlikeButton(tweet.parent) + Retweet(tweet.parent) + comment_form(tweet.parent) + commentModel(tweet.parent) +
            "</div>" +
            LikeButton(tweet) + UnlikeButton(tweet) + Retweet(tweet) + comment_form(tweet) + commentModel(tweet) +
            " </div>"
    }

    if (tweet.image !== null) {
        return tweet_container.innerHTML = "<div class='shadow-sm p-5' >" +
            showProfiles(tweet.profile, tweet_container) +
            "<h6 class='mt-5'>" + tweet['content'] + " </h6> " +
            "<img class='img-fluid m-2' id='tweet_image' heigth =500 width=500 src='" + tweet["image"] + "' /><br>" +
            LikeButton(tweet) + UnlikeButton(tweet) + Retweet(tweet) + comment_form(tweet) + commentModel(tweet) +
            "</div>"
    }

    return tweet_container.innerHTML = "<div class='shadow-sm p-5' >" +
        showProfiles(tweet.profile, tweet_container) +
        "<h6 class='mt-5'>" + tweet['content'] + " </h6> " +
        LikeButton(tweet) + UnlikeButton(tweet) + Retweet(tweet) + comment_form(tweet) + commentModel(tweet) +
        "</div>"
}

function LikeButton(tweet) {
    return "<button class='btn btn-sm btn-primary m-1' onclick=tweetAction('like','" + tweet.id + "','NUll') > " +
        "<i class=' fa text-white fa-thumbs-up' aria-hidden='true'></i> " + tweet['likes'] +
        "</button>"

}
function UnlikeButton(tweet) {
    return "<button class='btn btn-sm btn-primary m-1' onclick=tweetAction('unlike','" + tweet.id + "','NUll')>" +
        "<i class='fa fa-thumbs-down text-light '  aria-hidden='true'></i>"
        + "</button>"

}
function Retweet(tweet) {
    return "<button type='button' class='btn btn-sm  btn-primary m-1' onclick=retweet_content('retweet','" + tweet.id + "') >  Retweet </button>"
}
get_tweet()


// GET USER PROFILE
const username = document.getElementById('username').value
const profile_container = document.getElementById("profile")
function get_profile() {
    const xhr = new XMLHttpRequest()
    const method = "GET"
    const url = `/profiles/${username}/`
    xhr.responseType = "json"
    xhr.open(method, url)
    xhr.onload = function () {
        const ServerResponse = xhr.response
        showProfiles(ServerResponse, profile_container)
    }
    xhr.send()
}
get_profile()


function showProfiles(user, div) {
    return div.innerHTML = "<div>" +
        "<a href='/profile/user/" + user.username + "'><img src='" + user.image + "' class='image-fluid round shadow-sm' width=60 height-60 mr-2 />" + user.first_name + user.last_name + ' @' + user.username +
        "</div></a>"
}







function commentModel(tweet) {
    return "<button type='button' class='btn text-muted btn-white' data-toggle='modal' data-target='#commentModel'  onclick=get_comment(" + tweet.id + ") >" +
        " view comments.. " +
        "</button>"
}


const tweet_comment = document.getElementById("tweet_comment")
function get_comment(tweet_id) {
    const xhr = new XMLHttpRequest()
    const method = "GET"
    const url = "/tweet/show/comment/"
    xhr.responseType = "json"
    xhr.open(method, url)
    xhr.onload = function () {
        const SeverResponse = xhr.response
        const comments = SeverResponse
        let comment = ""
        let tweet = ''
        for (var i = 0; i < comments.length; i++) {
            comment += showComment(comments[i], tweet_id)
        }
        // tweet = showTweetModel(comments[i], tweet_id)

        tweet_comment.innerHTML = tweet + comment
    }
    xhr.send()
}


// const tweet_comment_image = document.getElementById("tweet_comment_image")

// function showTweetModel(comment, tweet_id) {
//     if (tweet_id === comment.tweet_id) {
//         if (comment.og_tweet.image !== null) {
//             return "<h6 class='mt-5'> " + comment.og_tweet['content'] + "</h6> " +
//                 "<img class='img-fluid'  heigth =500 width=500 src='" + comment.og_tweet["image"] + "' /><br>"
//         }
//         else {
//             return "<h6 class='mt-5'> " + comment.og_tweet['content'] + "</h6> "
//         }
//     }
//     else {
//         return "<div class='d-none'> </div>"
//     }
// }



function showComment(comment, tweet_id) {
    if (tweet_id === comment.tweet_id) {
        if (comment.og_tweet.image !== null) {
            return tweet_comment.innerHTML = "<div class ='shadow-sm col-12'>" +
                "</div>" +
                "<div class ='col-12'>" +
                showProfiles(comment.profile, tweet_container) +
                "<p class='pl-5 pb-3 ml-3'> " + comment.message + " </p>" +
                "</div>"
        }
        else {
            return tweet_comment.innerHTML = "<div class ='col-12'>" +
                showProfiles(comment.profile, tweet_container) +
                "<p class='pl-5 pb-3 ml-3'> " + comment.message + " </p>" +
                "</div>"
        }
    }
    else {
        return tweet_comment.innerHTML = "<p class='d-none'>  </p>"
    }
}



// for refresh
function Refresh() {
    window.parent.location = window.parent.location.href;
}


