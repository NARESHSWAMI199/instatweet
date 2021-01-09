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



const username = document.getElementById("username").value
const me = document.getElementById("me").value

console.log(username, me)

// GET USER PROFILE

const profile_container = document.getElementById("user_profile")
function get_profile() {
    const xhr = new XMLHttpRequest()
    let url = `/profiles/${username}/`
    url.replace(`http://127.0.0.1:8000/profiles/user/${username}`, '')
    const method = "GET"
    xhr.responseType = "json"
    xhr.open(method, url)
    xhr.onload = function () {
        const ServerResponse = xhr.response
        console.log(ServerResponse)
        if (xhr.status === 200) {
            showProfile(ServerResponse, profile_container)
        }
        else {
            profile_container.innerHTML = "<h3>" + ServerResponse.message + "</h3>"
        }
    }
    xhr.send()
}
get_profile()


// console.log('/tweet/profile/{{ username }}/')
function profileAction(action) {
    let url = `/profiles/${username}/`
    url.replace(`http://127.0.0.1:8000/profiles/user/${username}`, '')
    const method = 'POST'
    const data = JSON.stringify({
        action: action,
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
        console.log(ServerResponse)
        if (xhr.status === 200) {
            showProfile(ServerResponse, profile_container)
            get_tweet()
        }
        else {
            profile_container.innerHTML = ServerResponse.message
        }

    }
    xhr.send(data)
}



function showProfiles(user, div) {
    if (user.image === null) {
        return div.innerHTML = "<div>" +
            "<a href='/profile/user/" + user.username + "'><span class= 'text-light mb-5 bg-dark rounded-circle px-4 py-3'>" + user.username[0] + "</span>  " + user.first_name + user.last_name + ' @' + user.username +
            "</a></div>"
    }
    else {
        return div.innerHTML = "<div>" +
            "<a href='/profile/user/" + user.username + "'><img src='" + user.image + "' class='image-fluid round shadow-sm' width=60 height-60 mr-2 />" + user.first_name + user.last_name + ' @' + user.username +
            "</a></div>"
    }
}




function showProfile(user, div) {
    if (user.image === null) {
        return div.innerHTML = "<div>" +
            "<a href='/profile/user/" + user.username + "'><span class= 'text-light mb-5 bg-dark rounded-circle px-4 py-3'>" + user.username[0] + "</span>  " + user.first_name + user.last_name + ' @' + user.username +
            "</a></div>"
    }
    else if (user.bio !== null) {
        return div.innerHTML = "<div class='p-3  '>" +
            "<a href='/profile/user/" + user.username + "'><img src='" + user.image + "' class='image-fluid round shadow-sm' width=60 height-60 mr-2 />" + user.first_name + user.last_name + ' @' + user.username + "</a>" +
            "<p class='mt-2'>" + user.following + " following </p>" +
            "<p class=''>" + user.followers + " followers </p>" +
            "<p>" + user.bio + " </p>" +
            "<p>" + user.location + " </p>" +
            userFollowing(user) +
            "</div>"
    }
    else {
        return div.innerHTML = "<div class='p-3  '>" +
            "<a href='/profile/user/" + user.username + "'><img src='" + user.image + "' class='image-fluid round shadow-sm' width=60 height-60 mr-2 />" + user.first_name + user.last_name + ' @' + user.username + "</a>" +
            "<p class='mt-2'>" + user.following + " following </p>" +
            "<p class=''>" + user.followers + " followers </p>" +
            userFollowing(user) +
            "</div>"
    }
}





function userFollowing(user) {
    if (me !== username) {
        if (user.user_following === false) {
            console.log(user.user_following)
            return "<button  class ='btn btn-outline-primary' onclick=profileAction('follow')>Follow  </button>"
        }
        else if (user.user_following === true) {
            return "<button  class ='btn  btn-outline-primary' onclick=profileAction('unfollow')>Unollow  </button>"
        }
    }
    else {
        return "<button  class ='btn d-none btn-outline-primary' onclick=profileAction('follow')>Follow  </button>"
    }
}




// this is seprate view for following user's content

const tweet_container = document.getElementById("tweets")
function get_tweet() {
    const xhr = new XMLHttpRequest()
    const method = "GET"
    const url = "/tweet/feed"
    xhr.responseType = "json"
    xhr.open(method, url)
    xhr.onload = function () {
        const SeverResponse = xhr.response
        const tweets = SeverResponse
        // console.log(tweets)
        let tweet = ""
        for (var i = 0; i < tweets.length; i++) {
            tweet += showTweet(tweets[i])
        }
        tweet_container.innerHTML = tweet
    }
    xhr.send()
}


function tweetAction(action, id,content) {
    const url = '/tweet/action/'
    const method = 'POST'
    const data = JSON.stringify({
        id: id,
        action: action,
        content : content
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
        console.log(ServerResponse)
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


function retweet_content(action, id) {
    // $("#retweet").modal()
    let retweet = prompt("enter your retweet .")
    // const textarea = document.getElementById('create_retweet')
    tweetAction(action, id, retweet)
}




function showTweet(tweet) {
    if (tweet.parent !== null && tweet.parent.image !== null) {
        return tweet_container.innerHTML = " <div class='shadow-sm p-5' >" +
            showProfiles(tweet.profile, tweet_container) +
            "<h6 class='mt-5'>" + tweet['content'] + "</h6> " +
            "<div class='bg-light m-4 shadow-sm p-5' >" +
            showProfiles(tweet.parent.profile, tweet_container) +
            "<p class='mt-5' >" + tweet.parent['content'] + " </p>" +
            "<img class='img-fluid'  heigth =500 width=500 src='" + tweet.parent["image"] + "' /><br>" +
            LikeButton(tweet.parent) + UnlikeButton(tweet.parent) + Retweet(tweet.parent) +
            "</div>" +
            LikeButton(tweet) + UnlikeButton(tweet) + Retweet(tweet) +
            " </div>"
    }

    else if (tweet.parent !== null) {
        return tweet_container.innerHTML = " <div class='shadow-sm p-5' >" +
            showProfiles(tweet.profile, tweet_container) +
            "<h6 class='mt-5'>" + tweet['content'] + "</h6> " +
            "<div class='bg-light m-4 shadow-sm p-5' >" +
            showProfiles(tweet.parent.profile, tweet_container) +
            "<p class='mt-5' >" + tweet.parent['content'] + " </p>" +
            LikeButton(tweet.parent) + UnlikeButton(tweet.parent) + Retweet(tweet.parent) +
            "</div>" +
            LikeButton(tweet) + UnlikeButton(tweet) + Retweet(tweet) +
            " </div>"
    }

    if (tweet.image !== null) {
        return tweet_container.innerHTML = "<div class='shadow-sm p-5' >" +
            showProfiles(tweet.profile, tweet_container) +
            "<h6 class='mt-5'>" + tweet['content'] + " </h6> " +
            "<img class='img-fluid m-2' id='tweet_image' heigth =500 width=500 src='" + tweet["image"] + "' /><br>" +
            LikeButton(tweet) + UnlikeButton(tweet) + Retweet(tweet) +
            "</div>"
    }

    return tweet_container.innerHTML = "<div class='shadow-sm p-5' >" +
        showProfiles(tweet.profile, tweet_container) +
        "<h6 class='mt-5'>" + tweet['content'] + " </h6> " +
        LikeButton(tweet) + UnlikeButton(tweet) + Retweet(tweet) +
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
