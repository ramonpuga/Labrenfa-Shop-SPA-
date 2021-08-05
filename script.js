let cart = [];
let modalQt = 1;
let modalKey = 0;


const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

    // Listagem das prods
productJson.map((item, index)=>{
    let prodItem = c('.models .prod-item').cloneNode(true);
    prodItem.setAttribute('data-key', index);
    prodItem.querySelector('.prod-item--img img').src = item.img;
    prodItem.querySelector('.prod-item--price').innerHTML = `R$ ${item.price.toFixed(2).replace('.',',')}`;
    prodItem.querySelector('.prod-item--name').innerHTML = item.name;
    prodItem.querySelector('.prod-item--desc').innerHTML = item.description;
    // Evento de click p/ abrir o Modal
    prodItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.prod-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        c('.prodBig img').src = productJson[key].img;
        c('.prodInfo h1').innerHTML = productJson[key].name;
        c('.prodInfo--desc').innerHTML = productJson[key].description;
        c('.prodInfo--actualPrice').innerHTML = `R$ ${productJson[key].price.toFixed(2).replace('.',',')}`;
        
        
        cs('.prodInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = productJson[key].sizes[sizeIndex];
        });

        c('.prodInfo--qt').innerHTML = modalQt

        c('.prodWindowArea').style.opacity = 0;
        c('.prodWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.prodWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.prod-area').append( prodItem );
});
    // Eventos do Modal
function closeModal() { 
    c('.prodWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.prodWindowArea').style.display = 'none';
        c('.prodInfo--size.selected').classList.remove('selected');
    }, 500);
}
cs('.prodInfo--cancelButton, .prodInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.prodInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.prodInfo--qt').innerHTML = modalQt;
    }
});
c('.prodInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        c('.prodInfo--qt').innerHTML = modalQt;
});
cs('.prodInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.prodInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
c('.prodInfo--addButton').addEventListener('click', ()=>{
    let size = c('.prodInfo--size.selected').getAttribute('data-key');
    let identifier = productJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);
    
    if(key > -1){
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:productJson[modalKey].id,
            size,
            qt:modalQt
    });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        c('aside').style.left = 0;
    } else {
        c('aside').style.left = '100vw';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});


function updateCart() {

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';
        c('.menu-openner span').innerHTML = cart.length;
        

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let prodItem = productJson.find((item)=>item.id == cart[i].id);
            subtotal += prodItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let prodSizeName;
            cart[i].size == 0 ? prodSizeName = 'M' : '';
            cart[i].size == 1 ? prodSizeName = 'G' : '';
            cart[i].size == 2 ? prodSizeName = 'GG' : '';

            let prodName = `${prodItem.name} (${prodSizeName})`;
            cartItem.querySelector('img').src = prodItem.img;

            cartItem.querySelector('.cart--item-nome').innerHTML = prodName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1)
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        
        }   

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace('.', ',')}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.', ',')}`;

    } else {
        c('.menu-openner span').innerHTML = cart.length;
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

// Enviar e-mail com pedido detalhado via GMail
function sendMail(params) {   
    var tempParams ={
        nome: c(".nome").value,
        sobrenome: c(".sobrenome").value,
        cep: c(".cep").value,
        end: c(".end").value,
        num: c(".num").value,
        bairro: c(".bairro").value,
        cidade: c(".cidade").value,
        estado: c(".estado").value,
        cpf: c(".cpf").value,
        celular: c(".cel").value,
        email: c(".email").value,
        pagamento: c(".pagselecionado").value,
        dadospagamento: c("ul.seldados").innerText,
        pedido: cs('.cart--item-nome')[1].innerText +"-----"+ cs('.cart--item div:last-child')[1].innerText,
        subtotalFinal: c('.subtotal span:last-child').innerText,
        descontoFinal: c('.desconto span:last-child').innerText,
        totalFinal: c('.total span:last-child').innerText, 
    };
    if (cs('.cart--item-nome').length >= 3) {
    var tempParams ={
            nome: c(".nome").value,
            sobrenome: c(".sobrenome").value,
            cep: c(".cep").value,
            end: c(".end").value,
            num: c(".num").value,
            bairro: c(".bairro").value,
            cidade: c(".cidade").value,
            estado: c(".estado").value,
            cpf: c(".cpf").value,
            celular: c(".cel").value,
            email: c(".email").value,
            pagamento: c(".pagselecionado").value,
            dadospagamento: c("ul.seldados").innerText,
            pedido: cs('.cart--item-nome')[1].innerText +"-----"+ cs('.cart--item div:last-child')[1].innerText,
            pedido1: cs('.cart--item-nome')[2].innerText +"-----"+ cs('.cart--item div:last-child')[2].innerText,
            subtotalFinal: c('.subtotal span:last-child').innerText,
            descontoFinal: c('.desconto span:last-child').innerText,
            totalFinal: c('.total span:last-child').innerText,
        };
    }
    if (cs('.cart--item-nome').length >= 4) {
        var tempParams ={
                nome: c(".nome").value,
                sobrenome: c(".sobrenome").value,
                cep: c(".cep").value,
                end: c(".end").value,
                num: c(".num").value,
                bairro: c(".bairro").value,
                cidade: c(".cidade").value,
                estado: c(".estado").value,
                cpf: c(".cpf").value,
                celular: c(".cel").value,
                email: c(".email").value,
                pagamento: c(".pagselecionado").value,
                dadospagamento: c("ul.seldados").innerText,
                pedido: cs('.cart--item-nome')[1].innerText +"-----"+ cs('.cart--item div:last-child')[1].innerText,
                pedido1: cs('.cart--item-nome')[2].innerText +"-----"+ cs('.cart--item div:last-child')[2].innerText,
                pedido2: cs('.cart--item-nome')[3].innerText +"-----"+ cs('.cart--item div:last-child')[3].innerText,
                subtotalFinal: c('.subtotal span:last-child').innerText,
                descontoFinal: c('.desconto span:last-child').innerText,
                totalFinal: c('.total span:last-child').innerText,
            };
    }
    if (cs('.cart--item-nome').length >= 5) {
        var tempParams ={
                nome: c(".nome").value,
                sobrenome: c(".sobrenome").value,
                cep: c(".cep").value,
                end: c(".end").value,
                num: c(".num").value,
                bairro: c(".bairro").value,
                cidade: c(".cidade").value,
                estado: c(".estado").value,
                cpf: c(".cpf").value,
                celular: c(".cel").value,
                email: c(".email").value,
                pagamento: c(".pagselecionado").value,
                dadospagamento: c("ul.seldados").innerText,
                pedido: cs('.cart--item-nome')[1].innerText +"-----"+ cs('.cart--item div:last-child')[1].innerText,
                pedido1: cs('.cart--item-nome')[2].innerText +"-----"+ cs('.cart--item div:last-child')[2].innerText,
                pedido2: cs('.cart--item-nome')[3].innerText +"-----"+ cs('.cart--item div:last-child')[3].innerText,
                pedido3: cs('.cart--item-nome')[4].innerText +"-----"+ cs('.cart--item div:last-child')[4].innerText,
                subtotalFinal: c('.subtotal span:last-child').innerText,
                descontoFinal: c('.desconto span:last-child').innerText,
                totalFinal: c('.total span:last-child').innerText,
            };
    }
    if (cs('.cart--item-nome').length >= 6) {
        var tempParams ={
                nome: c(".nome").value,
                sobrenome: c(".sobrenome").value,
                cep: c(".cep").value,
                end: c(".end").value,
                num: c(".num").value,
                bairro: c(".bairro").value,
                cidade: c(".cidade").value,
                estado: c(".estado").value,
                cpf: c(".cpf").value,
                celular: c(".cel").value,
                email: c(".email").value,
                pagamento: c(".pagselecionado").value,
                dadospagamento: c("ul.seldados").innerText,
                pedido: cs('.cart--item-nome')[1].innerText +"-----"+ cs('.cart--item div:last-child')[1].innerText,
                pedido1: cs('.cart--item-nome')[2].innerText +"-----"+ cs('.cart--item div:last-child')[2].innerText,
                pedido2: cs('.cart--item-nome')[3].innerText +"-----"+ cs('.cart--item div:last-child')[3].innerText,
                pedido3: cs('.cart--item-nome')[4].innerText +"-----"+ cs('.cart--item div:last-child')[4].innerText,
                pedido4: cs('.cart--item-nome')[5].innerText +"-----"+ cs('.cart--item div:last-child')[5].innerText,
                subtotalFinal: c('.subtotal span:last-child').innerText,
                descontoFinal: c('.desconto span:last-child').innerText,
                totalFinal: c('.total span:last-child').innerText,
            };
    }
    if (cs('.cart--item-nome').length >= 7) {
        var tempParams ={
                nome: c(".nome").value,
                sobrenome: c(".sobrenome").value,
                cep: c(".cep").value,
                end: c(".end").value,
                num: c(".num").value,
                bairro: c(".bairro").value,
                cidade: c(".cidade").value,
                estado: c(".estado").value,
                cpf: c(".cpf").value,
                celular: c(".cel").value,
                email: c(".email").value,
                pagamento: c(".pagselecionado").value,
                dadospagamento: c("ul.seldados").innerText,
                pedido: cs('.cart--item-nome')[1].innerText +"-----"+ cs('.cart--item div:last-child')[1].innerText,
                pedido1: cs('.cart--item-nome')[2].innerText +"-----"+ cs('.cart--item div:last-child')[2].innerText,
                pedido2: cs('.cart--item-nome')[3].innerText +"-----"+ cs('.cart--item div:last-child')[3].innerText,
                pedido3: cs('.cart--item-nome')[4].innerText +"-----"+ cs('.cart--item div:last-child')[4].innerText,
                pedido4: cs('.cart--item-nome')[5].innerText +"-----"+ cs('.cart--item div:last-child')[5].innerText,
                pedido5: cs('.cart--item-nome')[6].innerText +"-----"+ cs('.cart--item div:last-child')[6].innerText,
                subtotalFinal: c('.subtotal span:last-child').innerText,
                descontoFinal: c('.desconto span:last-child').innerText,
                totalFinal: c('.total span:last-child').innerText,
            };
    }
    if (cs('.cart--item-nome').length >= 8) {
        var tempParams ={
                nome: c(".nome").value,
                sobrenome: c(".sobrenome").value,
                cep: c(".cep").value,
                end: c(".end").value,
                num: c(".num").value,
                bairro: c(".bairro").value,
                cidade: c(".cidade").value,
                estado: c(".estado").value,
                cpf: c(".cpf").value,
                celular: c(".cel").value,
                email: c(".email").value,
                pagamento: c(".pagselecionado").value,
                dadospagamento: c("ul.seldados").innerText,
                pedido: cs('.cart--item-nome')[1].innerText +"-----"+ cs('.cart--item div:last-child')[1].innerText,
                pedido1: cs('.cart--item-nome')[2].innerText +"-----"+ cs('.cart--item div:last-child')[2].innerText,
                pedido2: cs('.cart--item-nome')[3].innerText +"-----"+ cs('.cart--item div:last-child')[3].innerText,
                pedido3: cs('.cart--item-nome')[4].innerText +"-----"+ cs('.cart--item div:last-child')[4].innerText,
                pedido4: cs('.cart--item-nome')[5].innerText +"-----"+ cs('.cart--item div:last-child')[5].innerText,
                pedido5: cs('.cart--item-nome')[6].innerText +"-----"+ cs('.cart--item div:last-child')[6].innerText,
                pedido6: cs('.cart--item-nome')[7].innerText +"-----"+ cs('.cart--item div:last-child')[7].innerText,
                subtotalFinal: c('.subtotal span:last-child').innerText,
                descontoFinal: c('.desconto span:last-child').innerText,
                totalFinal: c('.total span:last-child').innerText,
            };
    }

    emailjs.send('service_l4ag0tk','template_79t2ecj',tempParams)
    .then(function(res){
        console.log("Sucess", res.status);
    })
}

// Show and Hide Modal de compra
function showmodal() {
    c('.modal').style.display = 'flex';
    c('.compra form').addEventListener("submit", event => {
        showpagamento();
        // Alert.render("Agora, escolha a forma de pagamento!");
        // c('.modal').style.display = 'none';
        event.preventDefault();
        // spareload();
    })
}

function hidemodal() {
    c('.modal').style.display = 'none';
}


// Show and Hide Consulta de cep
function showconsulta() {
    c('.consultacep').style.display = 'flex';
    c('.consultacep form').addEventListener("submit", event => {
        Alert.render("Consulta realizado com sucesso!");
        c('.consultacep').style.display = 'none';
        event.preventDefault();
        // spareload();
    })
}

function hideconsulta() {
    c('.consultacep').style.display = 'none';
    document.getElementById("cepform").reset();
    listaCep.innerHTML = ""
}

// Mascara campo CPF
var campoCpf = document.getElementById('cpf')


campoCpf.oninput = function (){
	if(cpf.selectionEnd == 3 || cpf.selectionEnd == 7){
		campoCpf.value += ".";
	}

	if(cpf.selectionEnd == 11){
		campoCpf.value += "-";
	}
}
/*
// Mascara campo CEP
var campoCep = document.getElementById('cep')

campoCep.oninput = function (){
	if(cep.selectionEnd == 5){
		campoCep.value += "-";
	}
}
*/
// Mascara campo CEL
var campoCel = document.getElementById('cel')

campoCel.oninput = function (){
	if(cel.selectionEnd == 2){
		campoCel.value += " ";
	}
	if(cel.selectionEnd == 4){
		campoCel.value += " ";
	}
	if(cel.selectionEnd == 9){
		campoCel.value += "-";
	}
}

// Reload da Single Page Aplication 
function spareload() {
    setTimeout(() => {
    window.location.reload(true);
      spareload();  
    }, 1000); // 1 segundo
};

// Consulta CEP

let cep1 = document.querySelector('.cep');
let rua1 = document.querySelector('.end');
let bairro1 = document.querySelector('.bairro');
let cidade1 = document.querySelector('.cidade');
let estado1 = document.querySelector('.estado');

// cep.value = '01001000'; // Cep central SP

cep.addEventListener('blur', function(e) {
	let cep1 = e.target.value;
	let script = document.createElement('script');
	script.src = 'https://viacep.com.br/ws/'+cep1+'/json/?callback=consultacpf';
	document.body.appendChild(script);
});

function consultacpf(resposta) {

	if("erro" in resposta) {
		Alert.render("CEP não encontrado");
		return;
	}

	rua1.value = resposta.logradouro;
	bairro1.value = resposta.bairro;
	cidade1.value = resposta.localidade;
	estado1.value = resposta.uf;
}

// Buscador de CEP

let rua = document.querySelector('.rua2');
let cidade = document.querySelector('.cidade2');
let uf = document.querySelector('.estado2');
let btnCep = document.querySelector('#btnBuscarCep');
let listaCep = document.querySelector('#listaCep');

btnCep.addEventListener('click', function(e) {
	e.preventDefault();

	let urlBase = 'https://viacep.com.br/ws/';
	let parametros = uf.value + '/' + cidade.value + '/' + rua.value + '/json/';
	let callback = '?callback=popularNaoSeiMeuCep';

	let script = document.createElement('script');
	script.src = urlBase + parametros + callback;
	document.body.appendChild(script);
    document.getElementById("cepform").reset();
});

function popularNaoSeiMeuCep(resposta) {

	if(!Array.isArray(resposta)) {
		Alert.render("O retorno não é uma lista de CEPs");
		return;
	}

	resposta.forEach(function(i) {

		let li = document.createElement('li');
		let endereco = i.logradouro + ' | ' + i.bairro + ' | ' + i.localidade + ' | ' + i.uf + ' | ' + i.cep;
		li.innerHTML = endereco;
		li.setAttribute('onclick', 'exibirCep('+i.cep.replace('-', '')+')')
		listaCep.appendChild(li);
	});
}

function exibirCep(cep){
	// Alert.render(cep + ' Esse é meu cep!')
    document.getElementById("cepform").reset();
    listaCep.innerHTML = ""
    hideconsulta();
    cep1.value = cep;
}

// Show and Hide Pagamento

function selectpag(){
    let pagsel = document.querySelector('.selpagamento')
    let showpagsel = pagsel.options[pagsel.selectedIndex].text;
    document.querySelector('.pagselecionado').value=showpagsel
    exibirdados();
}

// Dados para pagamento

let dadospadrao = "<a>Os dados para pagamento<br>serão enviados também<br>via e-mail</a>";
let dadosdep = "<a><strong>CPF</strong>: 425.461.278-88 <br><strong>Agência</strong>: 0001 <br><strong>Conta</strong>: 19345345-5 <br><strong>Banco</strong>: Nubank </a>"
let dadospix = "<a><strong>Chave Pix</strong>: chavepixlabrenfa <br><strong>Banco</strong>: Nubank </a>";
let dadostransf = "<a><strong>CPF</strong>: 425461278-88 <br><strong>Agência</strong>: 0001 <br><strong>Conta</strong>: 19345345-5 <br><strong>Banco</strong>: Nubank </a>"
let dados = c('.seldados')
let pagsel = c('.pagselecionado')

function exibirdados() {
    pagsel.value == "--Selecione a forma de pagamento--" ? dados.innerHTML = dadospadrao : '';
    pagsel.value == "Depósito" ? dados.innerHTML = dadosdep : '';
    pagsel.value == "Pix" ? dados.innerHTML = dadospix : '';
    pagsel.value == "Transferência" ? dados.innerHTML = dadostransf : '';
}
 
function showpagamento() {
    c('.pagamento').style.display = 'flex';
    c('.pagamento form').addEventListener("submit", event => {
        event.preventDefault();
        c('.pagamento').style.display = 'none';
        c('.finalcompra').style.display = 'flex';
        sendMail();
    })
}

function comprou() {
    c('.finalcompra').style.display = 'none';
    c('.compra').style.display = 'none'
    spareload(); 
}

function hidepagamento() {
    c('.pagamento').style.display = 'none';
    document.getElementById("pagamentoform").reset();
}

// Alert Personalizado

function CustomAlert() {
	this.render = function(dialog) {
		var winW = window.innerWidth;
		var winH = window.innerHeight;
		var dialogoverlay = document.getElementById('dialogoverlay');
		var dialogbox = document.getElementById('dialogbox');
		dialogoverlay.style.display = "block";
		dialogoverlay.style.height = winH+"px";
		dialogbox.style.left = "12%";
		dialogbox.style.top = "100px";
		dialogbox.style.display = "block";
        dialogbox.style.width = "350px";
		document.getElementById('dialogboxhead').innerHTML = "<strong>LABRENFA SHOP</strong>";
		document.getElementById('dialogboxbody').innerHTML = dialog;
		document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok() ">ok</button>';
	}
	this.ok = function() {
		document.getElementById('dialogbox').style.display = "none";
		document.getElementById('dialogoverlay').style.display = "none";
	}
}
var Alert = new CustomAlert()


/* ______________________________________________

Validador de CPF JavaScript Puro

var cpf = "169.169.000-75";
cpf = "469.957.937-06";
cpf = "425.461.278-88";

function isCPF(cpf = 0) {
	console.log(cpf);
	cpf = cpf.replace(/\.|-/g,"");

    var resultado = 0;
	let soma = 0;
	soma += cpf[0] * 10;
	soma += cpf[1] * 9;
	soma += cpf[2] * 8;
	soma += cpf[3] * 7;
	soma += cpf[4] * 6;
	soma += cpf[5] * 5;
	soma += cpf[6] * 4;
	soma += cpf[7] * 3;
	soma += cpf[8] * 2;
	soma = (soma * 10) % 11;
	if(soma == 10 || soma == 11)
        resultado = 1;
		soma = 0;
	console.log("1º Digito: "+soma);
	if(soma != cpf[9])
		return false;

	soma = 0;
	soma += cpf[0] * 11;
	soma += cpf[1] * 10;
	soma += cpf[2] * 9;
	soma += cpf[3] * 8;
	soma += cpf[4] * 7;
	soma += cpf[5] * 6;
	soma += cpf[6] * 5;
	soma += cpf[7] * 4;
	soma += cpf[8] * 3;
	soma += cpf[9] * 2;
	soma = (soma * 10) % 11;
	if(soma == 10 || soma == 11)	
		soma = 0;

	if(soma != cpf[10])
		return false;

	console.log("2º Digito: "+soma);
	return true;
}

console.log(isCPF(cpf) + resultado);
var resultado = isCPF(cpf);
____________________________________________
*/