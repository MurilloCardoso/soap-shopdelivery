const http = require('http');
const soap = require('soap');
const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();
const pedidos = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Interface HTML para atualizar pedidos
app.get('/atualizar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'atualizar.html'));
});

app.post('/atualizar-status', (req, res) => {
  const { numeroPedido, novoStatus } = req.body;
  if (pedidos[numeroPedido]) {
    pedidos[numeroPedido].status = novoStatus;
    return res.send(`Status do pedido ${numeroPedido} atualizado para "${novoStatus}"`);
  } else {
    return res.send(`Pedido ${numeroPedido} não encontrado.`);
  }
});

// Criação do servidor SOAP
const service = {
  TransportadoraService: {
    TransportadoraPort: {
      RegistrarPedido(args) {
        const id = args.numeroPedido;
        pedidos[id] = {
          ...args,
          statusSteps: ['Aguardando coleta'] // Inicializa com o primeiro step
        };
        console.log(`Pedido registrado: ${id}`);
        return { mensagem: `Pedido ${id} registrado com sucesso` };
      },
      ConsultarStatus(args) {
        const pedido = pedidos[args.numeroPedido];
        if (!pedido) return { status: ['Pedido não encontrado'] };
      
        return {
          numeroPedido: args.numeroPedido,
          itens: pedido.itens,
          quantidades: pedido.quantidades,
          enderecoEntrega: pedido.enderecoEntrega,
          destinatario: pedido.destinatario,
          status: pedido.statusSteps || ['Aguardando coleta']
        };
      },      
      AtualizarStatus(args) {
        const pedido = pedidos[args.numeroPedido];
        if (pedido) {
          let steps = args.novoStatus;
          if (!Array.isArray(steps)) {
            steps = [steps]; // garantir array
          }
          pedido.statusSteps = steps;
          return { mensagem: `Status atualizado com ${steps.length} passos` };
        } else {
          return { mensagem: 'Pedido não encontrado' };
        }
      }
    }
  }
};

const xml = fs.readFileSync('./transportadora.wsdl', 'utf8');

const soapServer = http.createServer((req, res) => res.end('SOAP Server'));
soap.listen(soapServer, '/wsdl', service, xml);

const expressServer = app.listen(8002, () => {
  console.log('Interface da transportadora: http://localhost:8002/atualizar');
});
soapServer.listen(8001, () => {
  console.log('SOAP ativo em http://localhost:8001/wsdl');
});
