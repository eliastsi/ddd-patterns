import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log.handler";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log2.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const handler = new EnviaConsoleLogHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);
    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined;
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined;
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined;

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(handler1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(handler2);

    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(handler);
    
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const handler = new EnviaConsoleLogHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);
    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(handler1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(handler2);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(handler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
    eventDispatcher.unregister("CustomerCreatedEvent", handler1);
    eventDispatcher.unregister("CustomerCreatedEvent", handler2);
    eventDispatcher.unregister("CustomerAddressChangedEvent", handler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(0);

  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const handler = new EnviaConsoleLogHandler()

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);
    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(handler1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(handler2);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(handler);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const handler = new EnviaConsoleLogHandler()
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);
    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(handler1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(handler2);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(handler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "fulano",
      address: "rua qualquer, 2",
    });


    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: "1",
      nome: "Fulaninho",
      endereco: "novo endereço",
    })

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    eventDispatcher.notify(customerCreatedEvent);

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
