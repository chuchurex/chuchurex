#!/usr/bin/env python3
"""
Generador y Verificador de Dominios .cl
Genera sugerencias inteligentes y verifica disponibilidad en tiempo real
"""

import socket
import sys
from typing import List, Tuple

def generar_variantes(palabras_clave: List[str], marca: str = "") -> List[str]:
    """
    Genera variantes de dominio basadas en palabras clave
    """
    variantes = set()
    
    # Combinaciones directas
    if len(palabras_clave) >= 2:
        p1, p2 = palabras_clave[0], palabras_clave[1]
        variantes.add(f"{p1}{p2}.cl")
        variantes.add(f"{p2}{p1}.cl")
        variantes.add(f"{p1}-{p2}.cl")
        variantes.add(f"{p2}-{p1}.cl")
    
    # Con descriptores
    descriptores = ['salud', 'bienestar', 'express', 'pro', 'ando', 'online']
    for desc in descriptores:
        for palabra in palabras_clave:
            variantes.add(f"{palabra}{desc}.cl")
            variantes.add(f"{desc}{palabra}.cl")
    
    # Con marca personal
    if marca:
        marca_limpia = marca.lower()
        for palabra in palabras_clave:
            variantes.add(f"{palabra}{marca_limpia}.cl")
            variantes.add(f"{marca_limpia}-{palabra}.cl")
    
    # Plurales y singulares
    for palabra in palabras_clave:
        if not palabra.endswith('s'):
            variantes.add(f"{palabra}es.cl")
        variantes.add(f"{palabra}s.cl")
    
    # Palabras individuales con sufijos
    for palabra in palabras_clave:
        variantes.add(f"mi{palabra}.cl")
        variantes.add(f"tu{palabra}.cl")
        variantes.add(f"el{palabra}.cl")
    
    return sorted(list(variantes))[:50]


def verificar_dominio(dominio: str) -> str:
    """
    Verifica disponibilidad de un dominio usando socket directo a whois.nic.cl
    Retorna: 'disponible', 'registrado', 'error', o 'timeout'
    """
    try:
        # Asegurar extensión .cl
        if not dominio.endswith('.cl'):
            dominio += '.cl'
            
        # Conectar al servidor WHOIS de NIC Chile
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(3)
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
        
        # Señales de disponibilidad
        disponible_keywords = [
            'no entries found',
            'no existe',
            'does not exist',
            'no data found'
        ]
        
        if any(keyword in output for keyword in disponible_keywords):
            return 'disponible'
        
        # Señales de que está registrado
        if 'registrant name:' in output or 'domain name:' in output:
            return 'registrado'
            
        # Fallback: si recibimos respuesta válida pero no "disponible", asumimos registrado
        if len(output) > 50:
            return 'registrado'
        
        return 'desconocido'
        
    except socket.timeout:
        return 'timeout'
    except Exception as e:
        return 'error'


def verificar_lote(dominios: List[str]) -> Tuple[List[str], List[str], List[str]]:
    """
    Verifica un lote de dominios
    Retorna: (disponibles, registrados, errores)
    """
    disponibles = []
    registrados = []
    errores = []
    
    total = len(dominios)
    for idx, dominio in enumerate(dominios, 1):
        print(f"  [{idx}/{total}] {dominio}...", end=" ", flush=True)
        estado = verificar_dominio(dominio)
        
        if estado == 'disponible':
            disponibles.append(dominio)
            print("✅")
        elif estado == 'registrado':
            registrados.append(dominio)
            print("❌")
        else:
            errores.append((dominio, estado))
            print(f"⚠️  ({estado})")
    
    return disponibles, registrados, errores


def main():
    if len(sys.argv) < 2:
        print("╔" + "="*58 + "╗")
        print("║  GENERADOR Y VERIFICADOR DE DOMINIOS .CL              ║")
        print("╚" + "="*58 + "╝\n")
        print("Uso: python3 generar_y_verificar_dominios.py palabra1 [palabra2] [--marca MiNombre]\n")
        print("Ejemplos:")
        print("  python3 generar_y_verificar_dominios.py masaje terapia")
        print("  python3 generar_y_verificar_dominios.py masaje --marca Javier")
        print("  python3 generar_y_verificar_dominios.py salud bienestar laboral\n")
        sys.exit(1)
    
    # Parsear argumentos
    args = sys.argv[1:]
    marca = ""
    palabras = []
    
    i = 0
    while i < len(args):
        if args[i] == '--marca' and i + 1 < len(args):
            marca = args[i + 1]
            i += 2
        else:
            palabras.append(args[i].lower())
            i += 1
    
    # Header
    print("\n╔" + "="*58 + "╗")
    print("║  GENERADOR Y VERIFICADOR DE DOMINIOS .CL              ║")
    print("╚" + "="*58 + "╝\n")
    
    # Mostrar parámetros
    print(f"📝 Palabras clave: {', '.join(palabras)}")
    if marca:
        print(f"👤 Marca personal: {marca}")
    print()
    
    # Generar variantes
    print("🔨 Generando variantes...")
    variantes = generar_variantes(palabras, marca)
    print(f"   ✓ {len(variantes)} variantes generadas\n")
    
    # Verificar
    print("🔍 Verificando disponibilidad en NIC.cl:\n")
    disponibles, registrados, errores = verificar_lote(variantes)
    
    # Resultados
    print("\n╔" + "="*58 + "╗")
    print("║  RESULTADOS                                            ║")
    print("╚" + "="*58 + "╝\n")
    
    if disponibles:
        print(f"✅ DISPONIBLES ({len(disponibles)}):\n")
        for i, dominio in enumerate(disponibles, 1):
            print(f"   {i}. {dominio}")
        print()
    
    if registrados:
        print(f"❌ REGISTRADOS ({len(registrados)}):\n")
        for dominio in registrados[:5]:
            print(f"   - {dominio}")
        if len(registrados) > 5:
            print(f"   ... y {len(registrados) - 5} más\n")
    
    if errores:
        print(f"⚠️  ERRORES ({len(errores)}):\n")
        for dominio, estado in errores[:3]:
            print(f"   - {dominio} ({estado})")
        if len(errores) > 3:
            print(f"   ... y {len(errores) - 3} más\n")
    
    # Recomendación
    if disponibles:
        print("╔" + "="*58 + "╗")
        print("║  RECOMENDACIÓN                                         ║")
        print("╚" + "="*58 + "╝\n")
        mejor = disponibles[0]
        print(f"🎯 Mejor opción: {mejor}")
        print("   (Disponible + SEO-friendly + Fácil de recordar)\n")
    else:
        print("⚠️  No se encontraron dominios disponibles.")
        print("   Intenta con palabras clave diferentes.\n")
    
    # Estadísticas
    print("─" * 60)
    print(f"Total verificados: {len(disponibles) + len(registrados) + len(errores)}")
    print(f"  • Disponibles: {len(disponibles)}")
    print(f"  • Registrados: {len(registrados)}")
    print(f"  • Con error: {len(errores)}")
    print("─" * 60 + "\n")


if __name__ == '__main__':
    main()
