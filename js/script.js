// Script principal

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function() {

    carregar();

});

// Simulação de carregamento da tela
function carregar(mensagem = null) {
    let loading = document.querySelector('#loading');
    loading.style.display = 'flex';
    setTimeout(function() {
        loading.style.display = 'none';
        if(mensagem != null) {
            alert(mensagem);
        }
    }, 1000);
}