"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <input type="checkbox" class="star favorite-stories" name="favorite-stories"/>
        <label for="favorite-stories"></label>  
        <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function favoritesHandler() {
  $favoriteStories = $('.favorite-stories');
  $favoriteStories.on('click', async function(e){
  if (!$(e.target).attr('checked')) {
    $(e.target).attr('checked', '');
    const response = await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${e.target.parentElement.id}`,
      method: "POST",
      data: { token: currentUser.loginToken },
    });
    currentUser.favorites = response.data.favorites;
  } else {
    $(e.target).removeAttr('checked');
    const response = await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${e.target.parentElement.id}`,
      method: "DELETE",
      data: { token: currentUser.loginToken },
    })
    currentUser.favorites = response.data.favorites;
  } 
});
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function restoreFavorites() {
  const allStoriesList = $allStoriesList.children();
  for (let idx of currentUser.favorites){
    for (let lis of allStoriesList) {
      if (idx.storyId === lis.id) {
        lis.getElementsByClassName('favorite-stories')[0].setAttribute('checked', '');
      }
    }
  }
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
    if(currentUser){
      if(currentUser.username === $allStoriesList.children()[$allStoriesList.children().length - 1].children[5].textContent.slice(10)) {
        const $trash = $('<i class="trash fa-regular fa-trash-can"></i>');
        $allStoriesList.children()[$allStoriesList.children().length - 1].prepend($trash[0]);
      }
    }    
  }

  if (currentUser) restoreFavorites();
  $favoriteStories = $('.favorite-stories');
  if (!currentUser) $favoriteStories.hide();
  $favoriteStories.on('click', async function(e){
  if (!$(e.target).attr('checked')) {
    $(e.target).attr('checked', '');
    await axios({
      url: `${BASE_URL}/users/${currentUser.username}/favorites/${e.target.parentElement.id}`,
      method: "POST",
      params: { token: currentUser.loginToken },
    });
    const response = await axios({
      url: `${BASE_URL}/users/${currentUser.username}`,
      method: "GET",
      params: { token: currentUser.loginToken },
    });
    
    currentUser.favorites = response.data.user.favorites;

    } else {
      $(e.target).removeAttr('checked');
      await axios({
        url: `${BASE_URL}/users/${currentUser.username}/favorites/${e.target.parentElement.id}`,
        method: "DELETE",
        params: { token: currentUser.loginToken },
      });
      const response = await axios({
        url: `${BASE_URL}/users/${currentUser.username}`,
        method: "GET",
        params: { token: currentUser.loginToken },
      });
      currentUser.favorites = response.data.user.favorites;
    } 
  });

  $allStoriesList.show();
}



async function postStory(evt){
  console.debug("postStory", evt);
  evt.preventDefault();
  const $author = $('#author').val();
  const $title = $('#title').val();
  const $url = $('#url').val();
  await storyList.addStory(currentUser, {
    title: $title,
    author: $author,
    url: $url
  });
  storyList = await StoryList.getStories();
  putStoriesOnPage();
  $submitForm.trigger("reset");
  $submitStory.hide();
}

$submitForm.on("submit", postStory);

//Delete User Story

$(document).on('click', 'i', deleteStory);

async function deleteStory(evt){
  const response = await axios({
    url: `${BASE_URL}/stories/${evt.target.parentElement.id}`,
    method: "DELETE",
    params: {
      token: currentUser.loginToken,
    }
  });
  storyList = await StoryList.getStories();
  putStoriesOnPage();
}

