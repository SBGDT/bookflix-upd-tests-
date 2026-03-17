let featuredKey="";
let featuredTitle="";

/* CREATE BOOK */

function createBook(book,parent){

let cover = book.cover_i
? "https://covers.openlibrary.org/b/id/"+book.cover_i+"-M.jpg"
: "https://via.placeholder.com/150x220?text=Book";

let title=book.title || "Unknown";

let author=book.author_name ? book.author_name[0] : "Unknown";

let t=title.toLowerCase();

let gutenbergLink=null;

for(let g in gutenbergBooks){
if(t.includes(g)){
gutenbergLink=gutenbergBooks[g];
break;
}
}

let available = gutenbergLink || book.has_fulltext;

let badge = available
? '<div class="badge available">AVAILABLE</div>'
: '<div class="badge unavailable">UNAVAILABLE</div>';

let div=document.createElement("div");
div.className="book";

div.innerHTML=`
${badge}
<img src="${cover}">
<div class="hoverCard">
<b>${title}</b><br>
${author}<br>
<button class="readBtn">READ</button>
</div>
`;

div.querySelector(".readBtn").onclick=()=>{

if(!available){
alert("Book not readable online");
return;
}

openReader(book.key,title);

};

parent.appendChild(div);

}

/* SEARCH */

async function searchBooks(){

document.getElementById("featured").style.display="none";

let query=document.getElementById("searchBox").value;

let res=await fetch(
"https://openlibrary.org/search.json?q="+encodeURIComponent(query)
);

let data=await res.json();

let results=document.getElementById("searchResults");

results.innerHTML="";

data.docs.slice(0,20).forEach(book=>{
createBook(book,results);
});

}

/* RECOMMENDATIONS */

async function loadRecommendations(){

let res=await fetch("https://openlibrary.org/search.json?q=classic");

let data=await res.json();

let results=document.getElementById("results");

results.innerHTML="";

data.docs.slice(0,20).forEach(book=>{
createBook(book,results);
});

}

/* FEATURED */

async function loadFeatured(){

let res=await fetch("https://openlibrary.org/search.json?q=fantasy");

let data=await res.json();

let book=data.docs[0];

if(!book)return;

let cover="https://covers.openlibrary.org/b/id/"+book.cover_i+"-L.jpg";

document.getElementById("featured").style.backgroundImage="url("+cover+")";

document.getElementById("featuredTitle").innerText=book.title;

document.getElementById("featuredAuthor").innerText=
book.author_name ? book.author_name[0] : "Unknown";

featuredKey=book.key;
featuredTitle=book.title;

}

function readFeatured(){
openReader(featuredKey,featuredTitle);
}

/* READER */

function openReader(key,title){

let frame=document.getElementById("readerFrame");

document.getElementById("reader").style.display="flex";

let t=title.toLowerCase();

for(let g in gutenbergBooks){
if(t.includes(g)){
frame.src=gutenbergBooks[g];
return;
}
}

frame.src="https://openlibrary.org"+key+"/embedded";

}

function closeReader(){

document.getElementById("reader").style.display="none";

document.getElementById("readerFrame").src="";

}

/* HOME */

function goHome(){

document.getElementById("featured").style.display="flex";

document.getElementById("searchResults").innerHTML="";

}

/* ENTER SEARCH */

document.getElementById("searchBox").addEventListener("keypress",function(e){

if(e.key==="Enter") searchBooks();

});

/* INIT */

loadFeatured();
loadRecommendations();

setTimeout(()=>{
document.getElementById("loader").classList.add("hide");
},1500);
