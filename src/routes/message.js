import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

var sites = [
    {
        code:   "CHRE",
        url:    "https://chacabucoenred.com/",
        logo:   "/logos/CHRE.png",
        name:   "Chacabuco en Red",
        status: 1
    },
    {
        code:   "CUAP",
        url:    "https://cuatropalabras.com/",
        logo:   "/logos/CUAP.jpg",
        name:   "Cuatro Palabras",
        status: 0
    },
    {
        code:   "QPCH",
        url:    "https://quepensaschacabuco.com/",
        logo:   "/logos/QPCH.jpg",
        name:   "Que pensás Chacabuco",
        status: 1
    },
    {
        code:   "CHRO",
        url:    "https://chacabuquero.com.ar/",
        logo:   "/logos/CHRO.jpg",
        name:   "Chacabuquero",
        status: 1
    },
    {
        code:   "DDEM",
        url:    "https://www.diariodemocracia.com/ciudad/chacabuco/",
        logo:   "/logos/DDEM.jpg",
        name:   "Diario Democracia",
        status: 1
    },
    {
        code:   "DHOY",
        url:    "https://dehoy.com.ar/",
        logo:   "/logos/DHOY.jpg",
        name:   "Diario de Hoy",
        status: 1
    },
    {
        code:   "CHAC",
        url:    "https://chacabuco.gob.ar/",
        logo:   "/logos/CHAC.jpg",
        name:   "Municipalidad de Chacabuco",
        status: 1
    },
    {
        code:   "RLID",
        url:    "https://radioliderchacabuco.com.ar/",
        logo:   "/logos/RLID.jpg",
        name:   "Radio Lider Chacabuco",
        status: 1
    },
    {
        code:   "LPCH",
        url:    "https://lapostachacabuco.com/",
        logo:   "/logos/LPCH.jpg",
        name:   "La Posta de Chacabuco",
        status: 1
    }
   
    
];
const axios = require('axios');
const cheerio = require('cheerio');
var posts = [];
function fechaActual(){
    var f = new Date();
    return f.getDate() +'/'+ (f.getMonth()+1) +'/'+ f.getFullYear();
}
function inArray(txt, array){
  var esta = false;
  array.forEach(
      function(valor){
          if(valor.trim() == txt.trim())esta = true;
      }
  );
    return esta;
}
function pushPost(post, post_priority, site_code){
    if(posts.findBy('title', post.title )==null){ //si no está repetido repetidos lo agrega
    	posts.push({
            title: post.title,
            image_url: post.image_url,
            category: post.categories,
            date: post.date,
            link: post.link,
            priority: post_priority,
            source: site_code,
            atitle: post.atitle, 
            order: post.order,
            excerpt: post.excerpt,
            content: post.content
        });
    }
}
//buscador
Array.prototype.findBy = function (column, value) {
    for (var i=0; i<this.length; i++) {
        var object = this[i];
        if (column in object && object[column] === value) {
            return object;
        }
    }
    return null;
}



function loadObjects(site){
     axios(site.url).then(response => {   
      var html = response.data;
      var $ = cheerio.load(html);
      let index; 
        
      var loop;
      switch(site.code){
          case 'DHOY':
                    index = 0;
                    loop = $('.zerogrid-section');
                    loop.each(function (i) {
                        if(i==0){
                            $(this).find('.noticia-grande').each(function () {
                                    let post = new Object();                                   
                                    post.image_url = site.url + $(this).find('img').attr("src");
                                    post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                                    post.excerpt = $(this).find('.subtitulo').text();
                                    post.categories = [];
                                    post.date = fechaActual();
                                    post.link = $(this).find('a').attr("href");
                                    post.atitle = $(this).find('.antetitulo').text();
                                    post.order = index;
                                    post.content = '';
                                    index += 1;
                                    pushPost(post,1,site.code);
                                }
                            );    
                        }
                    }); 
                    loop = $('.zerogrid-section');
                    loop.each(function (i) {
                        if(i==0){
                            $(this).find('.noticia-horizontal').each(function () {
                                    let post = new Object();
                                    post.image_url = site.url + $(this).find('img').attr("src");
                                    post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                                    post.atitle = $(this).find('.antetitulo').text();
                                    post.excerpt = $(this).find('.subtitulo').text();
                                    post.categories = [];
                                    post.date = ''; //$(this).find('.posted-on').text().trim();
                                    post.link = $(this).find('a').attr("href");
                                    post.order = index;
                                    post.content = '';
                                    index += 1;
                                    pushPost(post,1,site.code);
                                }
                            );
                        }
                    }); 
                     loop = $('.main-content');
                    loop.each(function (i) {
                        if(i==0){
                            $(this).find('article').each(function () {
                                    let post = new Object();
                                    post.image_url = site.url + $(this).find('img').attr("src");
                                    post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                                    post.atitle = $(this).find('.antetitulo').text();
                                    post.excerpt = $(this).find('.subtitulo').text();
                                    post.categories = [];
                                    post.date = ''; //$(this).find('.posted-on').text().trim();
                                    post.link = $(this).find('a').attr("href");
                                    post.order = index;
                                    post.content = '';
                                    index += 1;
                                    pushPost(post,1,site.code);
                                }
                            );    
                        }
                    }); 
                   
                    loop = $('.noticia-vertical');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = site.url + $(this).find(".picture img").attr("src");   
                        post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                        post.atitle = $(this).find('.antetitulo').text();
                        post.excerpt = $(this).find('.subtitulo').text();
                        post.categories = [];
                        post.date = ''; //$(this).find('.posted-on').text().trim();
                        post.link = $(this).find('a').attr("href");
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,2,site.code);
                    });
                    
                    loop = $('.zerogrid-section');
                    loop.each(function (i) {
                        if(i==1){
                            $(this).find('.noticia-horizontal').each(function () {
                                    let post = new Object();
                                    post.image_url = site.url + $(this).find('img').attr("src");
                                    post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                                    post.atitle = $(this).find('.antetitulo').text();
                                    post.excerpt = $(this).find('.subtitulo').text();
                                    post.categories = [];
                                    post.date = ''; //$(this).find('.posted-on').text().trim();
                                    post.link = $(this).find('a').attr("href");
                                    post.order = index;
                                    post.content = '';
                                    index += 1;
                                    pushPost(post,1,site.code);
                                }
                            );    
                        }
                    }); 
                    
                
                     loop = $('.main-content');
                    loop.each(function (i) {
                        if(i==1){
                            $(this).find('article').each(function () {
                                    let post = new Object();
                                    post.image_url = site.url + $(this).find('img').attr("src");
                                    post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                                    post.atitle = $(this).find('.antetitulo').text();
                                    post.excerpt = $(this).find('.subtitulo').text();
                                    post.categories = [];
                                    post.date = ''; //$(this).find('.posted-on').text().trim();
                                    post.link = $(this).find('a').attr("href");
                                    post.order = index;
                                    post.content = '';
                                    index += 1;
                                    pushPost(post,1,site.code);
                                }
                            );    
                        }
                    });
                    
                    loop = $('.zerogrid-section');
                    loop.each(function (i) {
                        if(i==2){
                            $(this).find('.noticia-horizontal').each(function () {
                                    let post = new Object();
                                    post.image_url = site.url + $(this).find('img').attr("src");
                                    post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                                    post.atitle = $(this).find('.antetitulo').text();
                                    post.excerpt = $(this).find('.subtitulo').text();
                                    post.categories = [];
                                    post.date = ''; //$(this).find('.posted-on').text().trim();
                                    post.link = $(this).find('a').attr("href");
                                    post.order = index;
                                    post.content = '';
                                    index += 1;
                                    pushPost(post,1,site.code);
                                }
                            );
                        }
                    }); 
                    
                     loop = $('.main-content');
                    loop.each(function (i) {
                        if(i==2){
                            $(this).find('article').each(function () {
                                    let post = new Object();
                                    post.image_url = site.url + $(this).find('img').attr("src");
                                    post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                                    post.atitle = $(this).find('.antetitulo').text();
                                    post.excerpt = $(this).find('.subtitulo').text();
                                    post.categories = [];
                                    post.date = ''; //$(this).find('.posted-on').text().trim();
                                    post.link = $(this).find('a').attr("href");
                                    post.order = index;
                                    post.content = '';
                                    index += 1;
                                    pushPost(post,1,site.code);
                                }
                            );    
                        }
                    });
                     loop = $('.main-content');
                    loop.each(function (i) {
                        if(i==2){
                            $(this).find('.noticia-horizontal-chica').each(function () {
                                    let post = new Object();
                                    post.image_url = site.url + $(this).find('img').attr("src");
                                    post.title = $(this).find('.titulo').text().toString().replace('\n','').replace('\n','').replace('          ','').replace('          ','').replace('  ','').replace('  ',''); 
                                    post.atitle = $(this).find('.antetitulo').text();
                                    post.excerpt = $(this).find('.subtitulo').text();
                                    post.categories = [];
                                    post.date = ''; //$(this).find('.posted-on').text().trim();
                                    post.link = $(this).find('a').attr("href");
                                    post.order = index;
                                    post.content = '';
                                    index += 1;
                                    pushPost(post,1,site.code);
                                }
                            );    
                        }
                    });
            break;
            case 'CHRE':
                    index = 0;
                    loop = $('.featured-posts .featured-posts__item');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).attr("style").replace('background-image: url(', '').replace(');', '');   
                        post.title = $(this).find('.entry-title').text();
                        post.categories = [];
                        post.date = $(this).find('.posted-on').text().trim();
                        post.link = $(this).find('.featured-posts__link').attr("href");
                        $(this).find('.featured-posts__category').each(function() {
                          post.categories.push(
                            $(this).text(),
                          );
                        }); 
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1; 
                        pushPost(post,1,site.code);
                    }); 
                    
                    loop = $('.posts-loop article');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find(".wp-post-image").attr("data-orig-file");   
                        post.title = $(this).find('.entry-title a').text();
                        post.categories = [];
                        post.date = $(this).find('.published').text();
                        post.link = $(this).find(".entry-thumbnail a").attr("href"); 
                        $(this).find('.cat-links a').each(function() {
                          post.categories.push(
                            $(this).text(),
                          );
                        });
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,2,site.code);
                    });
            break;
            case 'CHAC':
                    index = 0;
                    loop = $('#homerow2 article');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('img').attr("src");  
                        post.title = $(this).find('.entry-title a').text();
                        post.categories = [];
                        post.date = $(this).find('.published').text();
                        post.link = $(this).find('a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,2,site.code);
                    }); 
                    
                  
            break;
            case 'RLID':
                    index = 0;
                    loop = $('.td-module-container');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('.entry-thumb').attr("style").replace('background-image: url(', '').replace(');', '');    
                        post.title = $(this).find('.td-module-title a').text();
                        post.categories = [];
                        post.date = fechaActual();
                        post.link = $(this).find('a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,1,site.code);
                    }); 
                    
                    loop = $('.td_module_4');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('img').attr("src");    
                        post.title = $(this).find('.td-module-title a').text();
                        post.categories = [];
                        post.date = $(this).find('.entry-date').text();
                        post.link = $(this).find('a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,2,site.code);
                    });
                    
                    loop = $('.td_module_6');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('img').attr("src");    
                        post.title = $(this).find('.td-module-title a').text();
                        post.categories = [];
                        post.date = $(this).find('.entry-date').text();
                        post.link = $(this).find('a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,2,site.code);
                    });
                  
            break;
            case 'LPCH':
                    index = 0;
                    loop = $('.td_module_18');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('img').attr("src");
                        post.title = $(this).find('.td-module-title a').text();
                        post.categories = [];
                        post.date = $(this).find('.entry-date').text();
                        post.link = $(this).find('a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,1,site.code);
                    }); 
                    loop = $('.td_module_1');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('img').attr("src");    
                        post.title = $(this).find('.td-module-title a').text();
                        post.categories = [];
                        post.date = $(this).find('.entry-date').text();
                        post.link = $(this).find('a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,2,site.code);
                    });
                    loop = $('.td_module_2');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('img').attr("src");    
                        post.title = $(this).find('.td-module-title a').text();
                        post.categories = [];
                        post.date = $(this).find('.entry-date').text();
                        post.link = $(this).find('a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,2,site.code);
                    });
            break;
            case 'CUAP':
                    index = 0;
                    loop = $('.carousel-slider .item');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = site.url + $(this).find('img').attr("src");    
                        post.title = $(this).find('.title a').text();
                        post.categories = [];
                        post.date = '';//$(this).find('.posted-on').text().trim();
                        post.link = site.url + $(this).find('.title a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,1,site.code);
                    }); 
                    
                    loop = $('.layout-column article');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = site.url + $(this).find('img').attr("src");  
                        post.title = $(this).find('.title a').text().replace('\\n', '').trim();
                        post.categories = [];
                        post.date = '';//$(this).find('.posted-on').text().trim();
                        post.link = site.url + $(this).find('.title a').attr("href"); 
                        $(this).find('.cat-links a').each(function() {
                          post.categories.push(
                            $(this).text(),
                          );
                        });
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        if(inArray(post.title,['Últimas noticias','Tapas','Leé el diario en versión digital','Galería'])==false){
                          index += 1;
                          pushPost(post,2,site.code);
                        }
                    });
                    
            break;
            case 'QPCH':
                    index = 0;
                    loop = $('.row2 .noticia-destacada');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = site.url + $(this).attr("style").toString().replace('background-image: url(','').replace('); background-position: top center; background-repeat: no-repeat; background-size: cover','');  
                        post.title = $(this).find('.titulo2').text().replace('\\n','').trim();
                        post.categories = [$(this).find('.titulo').text()];
                        post.date = $(this).find('.fecha').text();
                        post.link = $(this).attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,1,site.code);
                    }); 
                    
                    loop = $('.row2 .noticia1');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = site.url + $(this).find('.foto_cont').attr("style").toString().replace('background-image: url(','').replace('\')','');    
                        post.title = $(this).find('.titulo2 a').text().trim();
                        post.categories = [$(this).find('.titulo').text()];
                        post.date = $(this).find('.fecha').text();
                        post.link = $(this).find('.foto_cont').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        if(inArray(post.title,['Últimas noticias','Tapas','Leé el diario en versión digital','Galería'])==false){
                          index += 1;
                          pushPost(post,2,site.code);
                        }
                    });
            break;
            case 'CHRO':
                    index = 0;
                    loop = $('.post-outer');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find("meta[itemprop='image_url']").attr("content");//.toString().replace('background-image: url(','').replace('); background-position: top center; background-repeat: no-repeat; background-size: cover','');
                        let find = "<br>\n<div style=\"clear: both;\"></div>";
                        post.title = $(this).find('.entry-content').text().replace(find,'').replace('\n','').replace('\n','').replace('\n','').replace('\n','')+' '+$(this).find('.post-title a').text();
                        post.date = $(this).find("abbr[itemprop='datePublished']").attr("title");
                        post.link = $(this).find('.post-title a').attr("href");
                        post.categories = [];
                        $(this).find("a[rel='tag']").each(function() {
                              post.categories.push(
                                $(this).text(),
                              );
                        });
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,1,site.code);
                    }); 
            break;       
            case 'DDEM':
                    index = 0;
                    loop = $('#main-news article');
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('img').attr("src");   
                        post.title = $(this).find('a').attr("title");
                        post.categories = [$(this).find('.titulo').text()];
                        post.date = $(this).find('.fecha').text();
                        post.link = site.url + $(this).find('a').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,1,site.code);
                    }); 
                    loop = $("div[id='contentActualizaciones'] article");
                    loop.each(function () {
                        let post = new Object();
                        post.image_url = $(this).find('.media-object').attr("data-src");   
                        post.title = $(this).find('.text-default span').text();
                        post.categories = [];
                        post.date = $(this).find('.fecha').text();
                        post.link = site.url + $(this).find('.text-default').attr("href");
                        post.atitle = '';
                        post.excerpt = '';
                        post.order = index;
                        post.content = '';
                        index += 1;
                        pushPost(post,2,site.code);
                        
                    });
                    loop = $(".section-chacabuco article"); 
                    loop.each(function () {
                        let post = new Object();
                        post.title = $(this).find('.text-default span').text();
                        if(post.title!=''){
                          post.image_url = $(this).find('img').attr("data-src");  
                          post.categories = [];
                          post.date = $(this).find('.fecha').text();
                          post.link = site.url + $(this).find('.text-default').attr("href");
                          post.atitle = '';
                          post.excerpt = '';
                          post.order = index;
                          post.content = '';
                          index += 1;
                          pushPost(post,3,site.code);
                        }
                    });
            break;     
      }//switch
      console.log(posts);
     }).catch(console.error);
}
for (let site of sites) {
  if(site.status){
    console.log('***********************************'+site.code);
    loadObjects(site);
  }
}



/*
posts.sort(function(a, b){
    return a.order > b.order;
  });
*/







const router = Router();
/*
router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.messages));
});
*/

router.get('/', (req, res) => {
  return res.send(posts);
});

router.get('/:messageId', (req, res) => {
  return res.send(req.context.models.messages[req.params.messageId]);
});

router.post('/', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.context.me.id,
  };

  req.context.models.messages[id] = message;

  return res.send(message);
});

router.delete('/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message,
    ...otherMessages
  } = req.context.models.messages;

  req.context.models.messages = otherMessages;

  return res.send(message);
});

export default router;
