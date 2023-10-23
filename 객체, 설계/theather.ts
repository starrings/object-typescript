// 극장에서 티켓을 통하여(돈 or 초대장) 연극을 보기 우한 클래스 설계

class Invitation {
  private LocalDateTime!: Date;
}

class Ticket {
  private fee!: number;

  public getFee(): number {
      return this.fee;
  }
}

class Bag {
  private amount!: number;
  private invitation?: Invitation;
  private ticket!: Ticket;

  // 생성자: 매개변수가 없는 생성자 (기본 생성자)
  // constructor(amount: number);
  // constructor(amount: number, invitation: Invitation);
  constructor(amount: number, invitation?: Invitation){
      this.invitation = invitation;
      this.amount = amount;
  }

  public hasInvitation(): boolean {
      return this.invitation != null;
  }

  public hasTicket(): boolean{
      return this.ticket != null;
  }

  public setTicket(ticket: Ticket){
      this.ticket = ticket;
  }

  public minusAmount(amount: number){
      this.amount -= amount;
  }

  public plusAmount(amount: number){
      this.amount += amount;
  }
}

class Audience {
  private bag: Bag;

  constructor(bag: Bag) {
      this.bag = bag;
  }

  public getBag(): Bag {
      return this.bag;
  }
}

class TicketOffice {
  private amount: number;
  private tickets: Ticket[] = new Array<Ticket>();

  constructor(amount: number, ...tickets: Ticket []){ // Rest 파라미터
      this.amount = amount;
      this.tickets.push(...tickets);
  }

  public getTicket(): Ticket | undefined {
      return this.tickets.shift();
  }

  public minusAmount(amount: number) {
      this.amount -= amount;
  }

  public plusAmount(amount: number) {
      this.amount += amount;
  }
}

class TicketSeller {
  private ticketOffice: TicketOffice;

  constructor(ticketOffice: TicketOffice){
      this.ticketOffice = ticketOffice;
  }

  public getTicketOffice(): TicketOffice {
      return this.ticketOffice;
  }
}

class Theather {
  private ticketSeller: TicketSeller;

  constructor(ticketSeller: TicketSeller){
      this.ticketSeller = ticketSeller;
  }

  public enter(audience: Audience){
      if(audience.getBag().hasInvitation()){
          const ticket = this.ticketSeller.getTicketOffice().getTicket();
          if(ticket){
              audience.getBag().setTicket(ticket);
          }
      }else {
          const ticket = this.ticketSeller.getTicketOffice().getTicket();
          if(ticket){
              audience.getBag().minusAmount(ticket.getFee());
              this.ticketSeller.getTicketOffice().plusAmount(ticket.getFee());
              audience.getBag().setTicket(ticket);
          }

      }
  }
}