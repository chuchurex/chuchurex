#!/usr/bin/env python3
"""
Script para verificar disponibilidad de dominios .cl
Utiliza WHOIS de NIC Chile
"""

import socket
import sys

def verificar_dominio(dominio):
    """
    Verifica si un dominio .cl está disponible o registrado usando socket directo
    Retorna: 'disponible', 'registrado', 'error', 'timeout'
    """
    
    # Asegurar que tiene extension .cl
    if not dominio.endswith('.cl'):
        dominio = dominio + '.cl'
    
    try:
        # Conectar al servidor WHOIS de NIC Chile
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(5)
            s.connect(('whois.nic.cl', 43))
            s.send(f"{dominio}\r\n".encode())
            
            # Recibir respuesta
            response = b""
            while True:
                data = s.recv(4096)
                if not data:
                    break
                response += data
        
        output = response.decode('latin-1', errors='ignore').lower()
        
        # Signos de que el dominio está disponible:
        if any(phrase in output for phrase in [
            'no entries found',
            'no existe',
            'does not exist',
            'no data found',
            'object does not exist',
            'no information available'
        ]):
            return 'disponible'
        
        # Si aparece información de registro, está ocupado
        if any(phrase in output for phrase in [
            'registrant name:',
            'domain name:',
            'admin name'
        ]):
            return 'registrado'
        
        # Fallback mejorado
        if len(output) > 50:
            return 'registrado'
        
        return 'desconocido'
        
    except socket.timeout:
        return 'timeout'
    except Exception as e:
        return f'error: {str(e)}'


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 verificar_dominios_cl.py dominio1 [dominio2 ...]")
        print("")
        print("Ejemplos:")
        print("  python3 verificar_dominios_cl.py masajesterapias")
        print("  python3 verificar_dominios_cl.py bienestarylaborales.cl")
        print("  python3 verificar_dominios_cl.py masajesterapias masajesalud terapiasdebienestar")
        sys.exit(1)
    
    dominios = sys.argv[1:]
    
    print("\n" + "="*60)
    print("VERIFICADOR DE DISPONIBILIDAD - DOMINIOS .CL")
    print("="*60 + "\n")
    
    resultados = {}
    
    for dominio in dominios:
        if not dominio.endswith('.cl'):
            dominio_busqueda = dominio + '.cl'
        else:
            dominio_busqueda = dominio
        
        print(f"Verificando: {dominio_busqueda}...", end=" ")
        sys.stdout.flush()
        
        estado = verificar_dominio(dominio_busqueda)
        resultados[dominio_busqueda] = estado
        
        if estado == 'disponible':
            print("✅ DISPONIBLE")
        elif estado == 'registrado':
            print("❌ REGISTRADO")
        elif estado == 'desconocido':
            print("❓ DESCONOCIDO")
        else:
            print(f"⚠️  {estado}")
    
    # Resumen
    print("\n" + "="*60)
    print("RESUMEN")
    print("="*60)
    
    disponibles = [d for d, e in resultados.items() if e == 'disponible']
    registrados = [d for d, e in resultados.items() if e == 'registrado']
    
    if disponibles:
        print(f"\n✅ Disponibles ({len(disponibles)}):")
        for d in disponibles:
            print(f"   - {d}")
    
    if registrados:
        print(f"\n❌ Registrados ({len(registrados)}):")
        for d in registrados:
            print(f"   - {d}")
    
    print("\n")


if __name__ == '__main__':
    main()
