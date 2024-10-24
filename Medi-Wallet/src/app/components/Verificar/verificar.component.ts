import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Login',
  templateUrl: './verificar.component.html',
  styleUrls: ['./verificar.component.css']
})
export class VerificarComponent {

  metamaskStatus = 'Verificando...';
  account: string | null = null;
  chainId: string | null = null;
  error = '';
  isConnecting = false;
  debugLogs: string[] = [];

  constructor() {
    this.checkMetaMaskStatus();
  }

  private log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.debugLogs.unshift(`[${timestamp}] ${message}`);
    console.log(message);
  }

  private async checkMetaMaskStatus() {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask no está instalado');
      }

      this.log('MetaMask detectado');
      this.metamaskStatus = 'MetaMask detectado';

      // Verificar si ya hay una cuenta conectada
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      this.log(`Cuentas encontradas: ${accounts.length}`);
      
      if (accounts.length > 0) {
        this.account = accounts[0];
        this.log(`Cuenta activa: ${this.account}`);
        
        // Obtener ID de la red
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        this.chainId = chainId;
        this.log(`Chain ID: ${chainId}`);
      }

      // Escuchar cambios de cuenta
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        this.log('Cambio de cuenta detectado');
        this.account = accounts[0] || null;
      });

      // Escuchar cambios de red
      window.ethereum.on('chainChanged', (chainId: string) => {
        this.log(`Cambio de red detectado: ${chainId}`);
        this.chainId = chainId;
      });

    } catch (err: any) {
      this.error = err.message;
      this.metamaskStatus = 'Error al detectar MetaMask';
      this.log(`Error: ${err.message}`);
    }
  }

  async connectWallet() {
    if (this.isConnecting) return;
    
    this.isConnecting = true;
    this.error = '';
    
    try {
      this.log('Intentando conectar wallet...');
      
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask no está instalado');
      }

      // Solicitar cuentas
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      this.log(`Cuentas obtenidas: ${accounts.length}`);
      
      if (accounts.length > 0) {
        this.account = accounts[0];
        this.log(`Conectado a: ${this.account}`);
        
        // Obtener ID de la red
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        this.chainId = chainId;
        this.log(`Chain ID actual: ${chainId}`);
      }

    } catch (err: any) {
      this.error = err.message;
      this.log(`Error al conectar: ${err.message}`);
      if (err.code === 4001) {
        this.error = 'Conexión rechazada por el usuario';
      }
    } finally {
      this.isConnecting = false;
    }
  }

}
