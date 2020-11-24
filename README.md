# Recuperação de senha

**RF**

- O usuario deve poder recuperar sua senha informando o seu e-mail;
- O usuario deve receber um email com instruções de recuperação de senha;
- O usuario deve poder resetar sua senha;

**RFN**

- Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano ( background job );

**RN**

- O link enviado para resetar a senha , deve expirar em 2 horas;
- O usuario precisa confirmar a nova senha para poder resetar sua senha;

# Atualização do perfil

**RF**

- O usuario deve poder atualizar o seu nome, e-email e senha;

**RN**

- O usuario não pode alterar o seu e-mail para um e-mail já utilizado;
- Para atualizar sua senha, o usuario deve informar a antiga;
- Para atualizar sua senha, o usuario precisa confirmar a nova senha;

# Painel do prestador

**RF**

- O usuario deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;


**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuario deve poder listar todos os prestadores de serviço cadastrados;
- O usuario deve poder listar os dias de um mês com pelo menos um horario disponivel de um prestador;
- O usuario deve poder listar os horarios disponiveis em um dia especifico de um prestador;
- O usuario deve poder realizar um novo agendamento com um prestador;

**RFN**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponiveis entre 8h e 18h (Primeiro às 8h, ultimo as 17h);
- O usuario não pode agendar em um horario já ocupado;
- O usuario não pode agendar em um horario que já passou;
- O usuario não pode agendar serviços consigo mesmo;
