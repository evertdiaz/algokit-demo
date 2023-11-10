import { Contract } from '@algorandfoundation/tealscript';

type User = { direccion: Address; tipo: uint256; nombee: stirng };


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
  
  registeredAsa = GlobalStateKey<Asset>();
  owner = GlobalStateKey<Address>();cd
  miembros = BoxMap<Control, bytes>();

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
    return registeredAsa;
  }

  cambiar_owner(new_owner: Address): void {
    assert(this.txn.sender == this.owner.value)
    this.owner.value = new_owner
  }

  // Esto Rompe
  /*
    agregar_miembro(member: Address): void {
      verifyTxn(this.txn, { sender: this.owner.value })
      const memberList = this.miembros.value || []
      if (!memberList.includes(member)) {
        memberList.push(member)
        this.miembros.value = memberList
      }
    }

    quitar_miembro(member: Address): void {
      verifyTxn(this.txn, { sender: this.owner.value })
      const memberList = this.miembros.value || []
      const index = memberList.indexOf(member)
      if (index !== -1) {
        memberList.splice(index, 1)
        this.miembros.value = memberList
      }
    }

    obtener_lista_miembros(): Address[] {
      return this.miembros.value ;
    }
  */

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
}
