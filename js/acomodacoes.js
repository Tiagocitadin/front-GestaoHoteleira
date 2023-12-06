// Script relacionado ao módulo de gerenciamento de acomodações

// Array principal armazenado no navegador
if(localStorage.getItem('listaAcomodacoes') == null) {
    listaAcomodacoes = [];
    localStorage.setItem('listaAcomodacoes', JSON.stringify(listaAcomodacoes));
} else {
    listaAcomodacoes = JSON.parse(localStorage.getItem('listaAcomodacoes'));
}

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function() {

    // Chamadas
    listar();

    // Salva cadastro e edição
    document.querySelector('#bt-salvar').addEventListener('click', function() {
        // Adiciona dados dos campos ao array principal
        let id = document.querySelector('#campo-id').value;

        let nome = document.querySelector('#campo-nome')?.value;
        let valor_diaria = document.querySelector('#campo-valor-diaria')?.value;
        let limite_hospedes = document.querySelector('#campo-limite-hospedes')?.value;
        let descricao = document.querySelector('#campo-descricao')?.value;


        // Trata os nomes de arquivo (considerando múltiplos arquivos)
        let nome_arquivo = Array.from(document.querySelector('#campo-nome-arquivo').files).map(file => file.name).join(',');


        // Ele joga para uma função que trata o tipo de midia
        let campo_tipo_midia = determinarTipoMidia(nome_arquivo);


        // Armazena a lista atualizada no navegador
        if (nome == null || nome.trim() === "") {
            alert("Nome obrigatório!");
        } else if (valor_diaria == null || valor_diaria.trim() === "") {
            alert("Valor da diária obrigatória!");
        } else if (limite_hospedes == null ||limite_hospedes.trim() === "") {
            alert("Limite de hóspedes obrigatório!");
        } else {
            if(id != "") { 
                let indice = getIndiceListaPorId(id)
                listaAcomodacoes[indice] = {
                    id: id, 
                    nome: nome,
                    valor_diaria: valor_diaria,
                    limite_hospedes: limite_hospedes,
                    descricao: descricao,
                    nome_arquivo: nome_arquivo,
                    campo_tipo_midia: campo_tipo_midia
                };
            } else {
                listaAcomodacoes.push({
                    id: getMaiorIdLista()+1,
                    nome: nome,
                    valor_diaria: valor_diaria,
                    limite_hospedes: limite_hospedes,
                    descricao: descricao,
                    nome_arquivo: nome_arquivo,
                    campo_tipo_midia: campo_tipo_midia
                });
            }
    
            localStorage.setItem('listaAcomodacoes', JSON.stringify(listaAcomodacoes));
    
            // Reseta o formulário e recarrega a tabela de listagem
            this.blur();
            limparCampos();
            carregar("Salvo com sucesso!");
            listar();
        }        
    });

    // Cancelamento de edição
    document.querySelector('#bt-cancelar').addEventListener('click', function() {
        limparCampos();
    });

    // Para tirar o texto do caminho abaixo de "Foto / Vídeo:"
    document.querySelector('#bt-limpar').addEventListener('click', function() {
        document.querySelector('#nome-arquivo-atual').textContent = "";
    });

});

// Funções 

function listar() {
    document.querySelector('table tbody').innerHTML = "";
    document.querySelector('#total-registros').textContent = listaAcomodacoes.length;

    listaAcomodacoes.forEach(function(objeto) {
        // Cria string html com os dados da lista (listaAcomodacoes)
        let htmlAcoes = "";
        htmlAcoes += '<button class="bt-tabela bt-editar" title="Editar"><i class="ph ph-pencil"></i></button>';
        htmlAcoes += '<button class="bt-tabela bt-excluir" title="Excluir"><i class="ph ph-trash"></i></button>';
        
        let htmlColunas = "";
        htmlColunas += "<td>"+objeto.id+"</td>";
        htmlColunas += "<td>"+objeto.nome+"</td>";
        htmlColunas += "<td>"+objeto.valor_diaria+"</td>";
        htmlColunas += "<td>"+objeto.limite_hospedes+"</td>";
        htmlColunas += "<td>"+objeto.descricao+"</td>";

        // Exibir os nomes de arquivo em uma única célula
        let arquivos = objeto.nome_arquivo.split(',').map(arquivo => arquivo.trim());
        htmlColunas += "<td>";
        arquivos.forEach(function(arquivo) {
            htmlColunas += arquivo + "<br>";
        });
        htmlColunas += "</td>";


        htmlColunas += "<td>"+objeto.campo_tipo_midia+"</td>";
        htmlColunas += "<td>"+htmlAcoes+"</td>";
        
        // Adiciona a linha ao corpo da tabela
        let htmlLinha = '<tr id="linha-'+objeto.id+'">'+htmlColunas+'</tr>';
        document.querySelector('table tbody').innerHTML += htmlLinha;
    });

    eventosListagem();
    carregar();
}

function eventosListagem() {
    // Ação de editar objeto
    document.querySelectorAll('.bt-editar').forEach(function(botao) {
        botao.addEventListener('click', function() {
            // Pega os dados do objeto que será alterado
            let linha = botao.parentNode.parentNode;
            let colunas = linha.getElementsByTagName('td');
            let id = colunas[0].textContent;
            let nome = colunas[1].textContent;
            let valor_diaria = colunas[2].textContent;
            let limite_hospedes = colunas[3].textContent;
            let descricao = colunas[4].textContent;
            let nome_arquivo = colunas[5].textContent;
    
            // Popula os campos do formulário
            document.querySelector('#campo-id').value = id;
            document.querySelector('#campo-nome').value = nome;
            document.querySelector('#campo-valor-diaria').value = valor_diaria;
            document.querySelector('#campo-limite-hospedes').value = limite_hospedes;
            document.querySelector('#campo-descricao').value = descricao;
            document.querySelector('#nome-arquivo-atual').textContent = nome_arquivo;
    
            // Exibe botão de cancelar edição
            document.querySelector('#bt-cancelar').style.display = 'flex';
    
            // Exibe os nomes de arquivo embaixo do p
            let arquivoAtualP = document.querySelector('#nome-arquivo-atual');
            arquivoAtualP.textContent = "";  // Limpa o conteúdo atual
    
            // Trata os nomes de arquivo (considerando múltiplos arquivos)
            let arquivos = nome_arquivo.split(',').map(arquivo => arquivo.trim());
            arquivos.forEach(function(arquivo) {
                arquivoAtualP.innerHTML += arquivo + "<br>";
            });
        });
    });

    // Ação de excluir objeto
    document.querySelectorAll('.bt-excluir').forEach(function(botao) {
        botao.addEventListener('click', function() {
            if(confirm("Deseja realmente excluir?")) {
                // Remove objeto da lista (listaAcomodacoes)
                let linha = botao.parentNode.parentNode;
                let id = linha.id.replace('linha-','');
                let indice = getIndiceListaPorId(id);
                listaAcomodacoes.splice(indice, 1);
    
                // Armazena a lista atualizada no navegador
                localStorage.setItem('listaAcomodacoes', JSON.stringify(listaAcomodacoes));
    
                // Recarrega a listagem
                listar();
            }
        });
    });
}

function limparCampos() {
    document.querySelector('#bt-cancelar').style.display = 'none';
        document.querySelector('#campo-id').value = "";
        document.querySelector('#campo-nome').value = "";
        document.querySelector('#campo-valor-diaria').value = "";
        document.querySelector('#campo-limite-hospedes').value = ""; 
        document.querySelector('#campo-descricao').value = "";
        document.querySelector('#nome-arquivo-atual').textContent = "";
        document.querySelector('#campo-nome-arquivo').value= "";
}

// Função para determinar o tipo de mídia com base no nome do arquivo
function determinarTipoMidia(nome_arquivo) {
    // Supondo que o nome do arquivo contenha a extensão do arquivo (por exemplo, "video.mp4" ou "imagem.jpg")
    let extensao = nome_arquivo.split('.').pop().toLowerCase();

    // Extensões permitidas para imagens e vídeos
    let extensoesImagem = ['jpg', 'jpeg', 'png', 'gif'];
    let extensoesVideo = ['mp4', 'mpeg', 'webm', 'ogg'];

    // Determinar o tipo de mídia com base na extensão e nas extensões permitidas
    if (extensoesImagem.includes(extensao)) {
        return 'Imagem';
    } else if (extensoesVideo.includes(extensao)) {
        return 'Video';
    } else {
        return 'Desconhecido';
    }
}

function getIndiceListaPorId(id) {
    indiceProcurado = null;
    listaAcomodacoes.forEach(function(objeto, indice) {
        if(id == objeto.id) {
            indiceProcurado = indice;
        }
    });
    return indiceProcurado;
}

function getMaiorIdLista() {
    if(listaAcomodacoes.length > 0) {
        return parseInt(listaAcomodacoes[listaAcomodacoes.length-1].id);
    } else {
        return 0;
    }
}
