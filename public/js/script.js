document.addEventListener('DOMContentLoaded', function() {

const closeSearch= document.getElementById('closeSearch');
const openSearchButton = document.getElementById('openSearchButton');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

closeSearch.addEventListener('click', function() {
    searchBar.style.visibility='hidden';
    
});
openSearchButton.addEventListener('click',function(){
    searchBar.style.visibility='visible';
});
// searchButton.addEventListener('click',function(){
//     if(searchInput.innerText===''){
//         alert('Search can\'t be empty');
//     }
//     else{
//         location.href='/search/'+searchInput.innerText;
//     }
// }
// )



});
