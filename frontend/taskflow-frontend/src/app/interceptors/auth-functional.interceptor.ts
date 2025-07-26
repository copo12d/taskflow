import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  console.log('🔍 Interceptor ejecutándose para:', req.url);
  console.log('🔑 Token encontrado:', token ? 'SÍ' : 'NO');
  
  if (token) {
    console.log('📝 Token completo:', token);
    console.log('📏 Longitud del token:', token.length);
    console.log('🔤 Primeros 50 caracteres:', token.substring(0, 50));
    
    // Verificar si el token parece ser un JWT válido
    const tokenParts = token.split('.');
    console.log('🧩 Partes del token:', tokenParts.length);
    
    if (tokenParts.length !== 3) {
      console.error('❌ TOKEN MALFORMADO: No tiene 3 partes separadas por puntos');
      console.error('🔍 Token recibido:', token);
    } else {
      console.log('✅ Token parece tener formato JWT válido');
    }
    
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('📤 Enviando petición con Authorization header');
    return next(authReq);
  }
  
  console.log('⚠️ No se encontró token, enviando petición sin Authorization');
  return next(req);
};
