import { Contract } from '@algorandfoundation/tealscript';

type User = { tipo: number; numero_reprocan: number }
type Producto = {precio: number; nombre: string}

// eslint-disable-next-line no-unused-vars
class Contrato extends Contract {
 
  // TODO
  /*
    CREAR UN ARRAY CON LAS DIRECCIONES QUE ESTAN EN EL CLUB
      direccion
      Esto seria util para que el frontend pueda preguntar al contrato y asi hacemos una especie de admin pannel (para que el adimin pueda dar tokens/congelar cuentas fácil)
      Esto quiza puede ser un diccionario que también trackee los balances

    VER COMO COMPROBAR CUANTOS TOKENS FUERON ENVIADOS EN UNA TRANSACCION
      Al saber como hacer esto podremos hacer los metodos de compra (por ahora hagamos solo compra de "Costo de cultivo")
  */
  
  registeredAsa = GlobalStateKey<Asset>()
  owner = GlobalStateKey<Address>()
  miembrosBox = BoxMap<Address, User>()
  productosBox = BoxMap<number, Producto>()

  createApplication(): void {
    this.owner.value = this.txn.sender;
  }

  // El contrato crea 1.000.000 de tokens para que el owner pueda dar
  bootstrap(): Asset {
    verifyTxn(this.txn, { sender: this.owner.value })

    const registeredAsa = sendAssetCreation({
      configAssetTotal: 1_000_000,
      configAssetFreeze: this.app.address
    })

    this.registeredAsa.value = registeredAsa;
    log("Asset Creado de forma correcta")
    return registeredAsa;
  }

  // Cambia quien es el owner del contrato
  cambiar_owner(new_owner: Address): void {
    assert(this.txn.sender == this.owner.value)
    this.owner.value = new_owner
  }

  // Agrega un miembro a el array de miembros
  agregar_miembro(address: Address, tipo: number, numero_reprocan: number): void {
    verifyTxn(this.txn, { sender: this.owner.value })

    if (this.miembrosBox(address).exists){
      throw 'este usuario ya existe'
    }

    const usuario : User = { tipo: tipo, numero_reprocan: numero_reprocan}
    this.miembrosBox(address).value = (usuario)
  }

  // quita miembro del array de miembros
  quitar_miembro(address: Address): void {
    verifyTxn(this.txn, { sender: this.owner.value })

    if (!this.miembrosBox(address).exists){
      throw 'este usuario no existe'
    }

    this.miembrosBox(address).delete()
  }

  // busca un mienbro por direccion
  get_miembro(address: Address): User {
    verifyTxn(this.txn, { sender: this.owner.value })

    if (!this.miembrosBox(address).exists){
      throw 'este usuario no existe'
    }
    return this.miembrosBox(address).value;
  }

  //Con esta funcion el dueño del club puede enviar los tokens a cualquier biilletera luego de recibir el pago 
  enviar_fondos(enviar_a: Address, cantidad: number, registeredAsa: Asset): void {
    verifyTxn(this.txn, { sender: this.owner.value })

    // Enviar asset al miembro que se desee
    sendAssetTransfer({
      xferAsset: this.registeredAsa.value,
      assetReceiver: enviar_a,
      assetAmount: cantidad
    });
  }

  congelar_billetera(target: Address, registeredAsa: Asset): void {
    sendAssetFreeze({
      freezeAsset: this.registeredAsa.value,
      freezeAssetAccount: target,
      freezeAssetFrozen: true
    })
  }

  descongelar_billetera(target: Address, registeredAsa: Asset): void {
    sendAssetFreeze({
      freezeAsset: this.registeredAsa.value,
      freezeAssetAccount: target,
      freezeAssetFrozen: false
    })
  }

  getRegisteredAsa(): Asset {
    return this.registeredAsa.value;
  }


  getOwner(): Address {
    return this.owner.value
  }

  // aca el user va a poder comprar cosas
  realizarPago(id: number, payment: AssetTransferTxn): void {
    if (this.productosBox(id).exists) {
      const :
      verifyTxn(payment, {
        receiver: this.app.address,
        assetAmount: 1,
        xferAsset: this.registeredAsa.value
      })
      

    }

  }

  agreagar_producto(): void {
    if (this.productosBox(id).exists) {
      th
    }


  }

}
