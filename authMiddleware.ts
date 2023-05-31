import jwt ,{JwtPayload} from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import axios from 'axios';
import { LocalStorage } from "ts-localstorage";

const prisma = new PrismaClient()

const accessTokenScret = process.env.ACCESS_TOKEN_SECRET


// Faz login e obtém um token JWT do servidor
async function login(username: string, password: string): Promise<string> {
    const res = await axios.post<{ token: string }>('/login', { username, password });
    const token = res.data.token;
    localStorage.setItem('token', token); // Salva o token no local storage
    return token;
  }
  
  // Faz uma requisição protegida ao servidor, passando o token no header de autorização
  async function getProtectedData(): Promise<string> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    const res = await axios.get<{ message: string }>('/protected', {
      headers: {
        Authorization: `Bearer ${token}` // Envia o token no header de autorização
      }
    });
    return res.data.message;
  }
  
  // Exemplo de uso
  login('user', '123')
    .then(() => getProtectedData())
    .then(console.log)
    .catch(console.error);
  
  
  
  
  


  
