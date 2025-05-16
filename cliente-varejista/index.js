const express = require('express');
const soap = require('soap');
const path = require('path');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const wsdlUrl = 'http://localhost:8001/wsdl?wsdl';

app.post('/registrar', async (req, res) => {
  const pedido = {
    numeroPedido: req.body.numero,
    itens: req.body.itens,
    quantidades: req.body.quantidades,
    enderecoEntrega: req.body.endereco,
    destinatario: req.body.destinatario
  };

  const client = await soap.createClientAsync(wsdlUrl);
  const [result] = await client.RegistrarPedidoAsync(pedido);
  res.json(result);
});
app.post('/atualizar', async (req, res) => {
  const { numeroPedido, novoStatus } = req.body;

  const client = await soap.createClientAsync(wsdlUrl);
  const [result] = await client.AtualizarStatusAsync({
    numeroPedido,
    novoStatus // pode ser um array de strings!
  });

  res.json(result);
});
app.get('/status/:numero', async (req, res) => {
  const numeroPedido = req.params.numero;
  const client = await soap.createClientAsync(wsdlUrl);
  const [result] = await client.ConsultarStatusAsync({ numeroPedido });

  // Corrige se o status vier como { string: [...] }
  const statusList =
    Array.isArray(result.status?.string) ? result.status.string :
    Array.isArray(result.status) ? result.status :
    typeof result.status === 'string' ? [result.status] :
    [];

  res.json({
    numeroPedido: result.numeroPedido,
    destinatario: result.destinatario,
    enderecoEntrega: result.enderecoEntrega,
    itens: result.itens,
    quantidades: result.quantidades,
    status: statusList
  });
});

app.listen(3000, () => console.log('Cliente rodando em http://localhost:3000'));
