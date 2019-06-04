import getMetricsFromURLs from './testAMP';


const urlArray: string[] = ['https://www.theverge.com/platform/amp/2018/4/28/17295066/post-credits-scene-avengers-infinity-war-answers-explanation-captain-marvel-symbol-pager',
'https://www.loteriasdehoy.com/sinuano',
'https://www.wired.com/story/yanny-and-laurel-true-history/amp',
'http://ww1.vdli.net/amp/',
'https://g1.globo.com/google/amp/g1.globo.com/pop-arte/musica/noticia/dj-avicii-morre-diz-agencia.ghtml',
'https://mobile.nytimes.com/2018/05/18/us/school-shooting-santa-fe-texas.amp.html',
'http://www.ydr9.com/amp/',
'https://globoesporte.globo.com/google/amp/globoesporte.globo.com/futebol/selecao-brasileira/noticia/lista-fechada-tite-anuncia-os-23-convocados-para-a-copa-do-mundo.ghtml',
'http://amp.catnepal.com/amp/',
'https://irish.national-lottery.com/amp/irish-lotto/results',
'http://ww6.asipp.net/amp/','https://www.theverge.com/platform/amp/2018/4/28/17295066/post-credits-scene-avengers-infinity-war-answers-explanation-captain-marvel-symbol-pager',
'https://www.loteriasdehoy.com/sinuano',
'https://www.wired.com/story/yanny-and-laurel-true-history/amp',
'http://ww1.vdli.net/amp/',
'https://g1.globo.com/google/amp/g1.globo.com/pop-arte/musica/noticia/dj-avicii-morre-diz-agencia.ghtml',
'https://mobile.nytimes.com/2018/05/18/us/school-shooting-santa-fe-texas.amp.html',
'http://www.ydr9.com/amp/',
'https://globoesporte.globo.com/google/amp/globoesporte.globo.com/futebol/selecao-brasileira/noticia/lista-fechada-tite-anuncia-os-23-convocados-para-a-copa-do-mundo.ghtml',
'http://amp.catnepal.com/amp/',
'https://irish.national-lottery.com/amp/irish-lotto/results',
'http://ww6.asipp.net/amp/']

getMetricsFromURLs(urlArray, 30720, 15360, 2).then(data => {console.log(data)
})