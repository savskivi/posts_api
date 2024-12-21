const postTemplate = document.querySelector('.post-template');
const tagTemplate = document.querySelector('.tag-template');
const postList = document.querySelector('.post-list');
const tagList = document.querySelector('.tag-list');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const sortList = document.querySelector('.sort');
const paginationLeft = document.querySelector('.pagination-left');
const paginationRight = document.querySelector('.pagination-right');
const paginationPage = document.querySelector('.pagination-page');

let search = '';
let selectedTag = '';

const limit = 10;
let skip = 0;
let page = 1;
let total = limit;


const sortTypes = {
    1: {
        sortBy: 'id',
        order: 'asc'
    },

    2: {
        sortBy: 'reactions_likes',
        order: 'desc'
    },

    3: {
        sortBy: 'views',
        order: 'desc'
    },

    4: {
        sortBy: 'title',
        order: 'asc'
    }
}

let activeSort = sortTypes[1];

fetch('https://dummyjson.com/posts/tag-list')
.then(res => res.json())
.then((data) => renderTags(data));

fetchPosts();

function fetchPosts(){
    let path = 'https://dummyjson.com/posts';

    if(selectedTag){
        path += `/tag/${selectedTag}`;
    }

    if(search){
        path += `/search?q=${search}`;
    }

    if(search){
        path += '&';
    } else{
        path += '?';
    }
    path += `limit=${limit}&skip=${skip}`;

    if(activeSort){
        path += `&sortBy=${activeSort.sortBy}&order=${activeSort.order}`;
    }

    fetch(path)
        .then(res => res.json())
        .then((data) => {
            total = data.total;
            renderPosts(data.posts)});
}

function renderPosts(posts){
    postList.innerHTML = null;
    posts.forEach((item) => {
        const clone = postTemplate.content.cloneNode(true);

        const postTitle = clone.querySelector('.post-title');
        postTitle.innerHTML = item.title;

        const postBody = clone.querySelector('.post-body');
        postBody.innerHTML = item.body;

        const postTags = clone.querySelector('.post-tags')
        // InnerHTML не подходит, потому что весь массив тегов становится строкой. Весь массив отображается внутри одного div с классом tag, а не создаются отдельные элементы для каждого тега. Создаем элементы тегов:
        item.tags.forEach((tag) => {
            const tagElement = document.createElement('div');
            tagElement.classList.add('tag');
            tagElement.innerHTML = `#${tag}`;
            postTags.append(tagElement);
        });

        const likes = clone.querySelector('.likes')
        likes.innerHTML = item.reactions.likes;

        const dislikes = clone.querySelector('.dislikes');
        dislikes.innerHTML = item.reactions.dislikes;

        const views = clone.querySelector('.views');
        views.innerHTML = item.views;

        postList.append(clone);
    })
}

function renderTags(tags) {
    tags.forEach((tag) => {
        const clone = tagTemplate.content.cloneNode(true);

        const tagItem = clone.querySelector('.tag'); 
        tagItem.innerHTML = '#' + tag; 
        tagItem.value = tag;

        tagList.append(clone); 
    });

    tagList.onchange = function(){
        selectedTag = tagList.value;
        fetchPosts();
    }
}

searchBtn.onclick = doSearch;

function doSearch(){
    search = searchInput.value;
    fetchPosts();
}

searchInput.oninput = clearInput;

function clearInput(){
    if (searchInput.value == ''){
        search = '';
        fetchPosts();
    }
}

sortList.onchange = changeSort;

function changeSort(){
    activeSort = sortTypes[sortList.value];
    fetchPosts();
}

paginationLeft.onclick = prevPage;
paginationRight.onclick = nextPage;

function prevPage(){
    if(skip != 0){
        page--;
        paginationPage.innerHTML = page;
        skip = (page - 1) * limit;
        fetchPosts()
    }
}

function nextPage(){
    if(skip < total - limit){
        page++;
        paginationPage.innerHTML = page;
        skip = (page - 1) * limit;
        fetchPosts();
    }
}