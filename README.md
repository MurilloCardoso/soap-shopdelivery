Integração de Pedidos com Transportador via SOAP
Este projeto simula a integração entre um sistema de compras de uma empresa varejista e o sistema de entregas de um transportador, utilizando Web Services SOAP para troca de dados em tempo real.

📦 Objetivo
Automatizar o envio e acompanhamento de pedidos entre a empresa varejista e o transportador, garantindo rastreamento atualizado por meio de chamadas SOAP.

🧩 Estrutura do Projeto
O projeto é dividido em dois sistemas distintos:

Cliente (Varejista): Sistema de compras que gera e envia pedidos.

Servidor (Transportador): Serviço de entregas que recebe pedidos e atualiza seu status.

🔁 Fluxo de Integração
1. Registro de Pedido
O Sistema de Compras cria um pedido com informações como:

Número do pedido

Itens e quantidades

Endereço de entrega

Nome do destinatário

O pedido é enviado via SOAP ao servidor (Transportador).

O servidor armazena o pedido com status inicial: "Aguardando coleta".

Uma resposta de confirmação SOAP é retornada ao cliente.

2. Consulta de Status
O cliente pode consultar o status de qualquer pedido a qualquer momento.

O servidor responde com o status atual:

Aguardando coleta

Em transporte

Entregue

Falha na entrega

Pedido não encontrado

3. Atualização de Status
O transportador pode atualizar o status de um pedido (manualmente ou automaticamente).

Essas mudanças refletem no sistema do cliente por meio de novas consultas SOAP.

📌 Regras e Requisitos
Comunicação entre sistemas exclusivamente via SOAP.

Os pedidos devem ser serializados e desserializados em XML.

O cliente pode consultar o status dos pedidos a qualquer momento.

✅ Pré-Condições
O Sistema de Compras (cliente) está em operação.

O Sistema do Transportador (servidor) possui um endpoint SOAP funcional.

📂 Entrega
O projeto é composto por:

Código-fonte do Cliente (Sistema de Compras)

Código-fonte do Servidor (Sistema do Transportador)

📅 Data de Apresentação: 19/05/2025

🚀 Tecnologias Utilizadas
Node.js + Express (para simulação do ambiente SOAP)

Bibliotecas para SOAP/XML (como soap e xml2js)

Ferramentas para testes locais de integração

