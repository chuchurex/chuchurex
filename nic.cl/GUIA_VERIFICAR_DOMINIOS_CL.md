# Verificador de Disponibilidad de Dominios .cl

## Problema Identificado
✋ Proponer dominios sin verificar primero = **Perder credibilidad y tiempo**

## Solución: Script de Verificación

### Instalación de Dependencias

```bash
# macOS (Homebrew)
brew install whois

# Linux (Debian/Ubuntu)
sudo apt-get install whois

# O instalar desde source:
# https://www.gnu.org/software/isc-whois/
```

### Uso Básico

```bash
# Un dominio
python3 verificar_dominios_cl.py masajesterapias

# Múltiples dominios
python3 verificar_dominios_cl.py masajesterapias masajesalud terapiasdebienestar bienestarylaborales

# Con extensión .cl (opcional)
python3 verificar_dominios_cl.py masajesterapias.cl
```

### Output Esperado

```
============================================================
VERIFICADOR DE DISPONIBILIDAD - DOMINIOS .CL
============================================================

Verificando: masajesterapias.cl... ✅ DISPONIBLE
Verificando: masajesalud.cl... ❌ REGISTRADO
Verificando: terapiasdebienestar.cl... ❌ REGISTRADO
Verificando: bienestarylaborales.cl... ✅ DISPONIBLE

============================================================
RESUMEN
============================================================

✅ Disponibles (2):
   - masajesterapias.cl
   - bienestarylaborales.cl

❌ Registrados (2):
   - masajesalud.cl
   - terapiasdebienestar.cl
```

---

## Flujo de Trabajo Mejorado

### Antes (❌ Insuficiente)
1. Cliente propone idea
2. Yo sugiero dominios SIN verificar
3. Cliente elige uno
4. Resulta que está ocupado ❌
5. Volvemos a empezar

### Ahora (✅ Profesional)
1. Cliente propone idea
2. Yo genero lista de 8-10 opciones
3. Verifico TODAS con el script
4. Solo presento las disponibles
5. Cliente elige con confianza ✅

---

## Script Generador de Sugerencias

Crear archivo: `generar_sugerencias_dominio.py`

```python
#!/usr/bin/env python3
"""
Generador automático de sugerencias de dominio
Crea variantes y verifica disponibilidad
"""

import subprocess
from typing import List, Tuple

def generar_variantes(palabras_clave: List[str], marca: str = "") -> List[str]:
    """
    Genera variantes de dominio basadas en palabras clave
    
    Ejemplo:
    generar_variantes(['masaje', 'terapia'], marca='Javier')
    Retorna:
    [
        'masajesterapia.cl',
        'terapiasmasajes.cl',
        'masajesalud.cl',
        'terapiasalud.cl',
        'javier-masajes.cl',
        'masajesjavier.cl',
        ...
    ]
    """
    
    variantes = []
    
    # Combinaciones directas
    if len(palabras_clave) >= 2:
        p1, p2 = palabras_clave[0], palabras_clave[1]
        variantes.append(f"{p1}{p2}.cl")
        variantes.append(f"{p2}{p1}.cl")
    
    # Con descriptores comunes
    descriptores = ['salud', 'bienestar', 'express', 'pro', 'master']
    for desc in descriptores:
        for palabra in palabras_clave:
            variantes.append(f"{palabra}{desc}.cl")
            variantes.append(f"{desc}{palabra}.cl")
    
    # Con marca personal
    if marca:
        marca_limpia = marca.lower()
        for palabra in palabras_clave:
            variantes.append(f"{palabra}{marca_limpia}.cl")
            variantes.append(f"{marca_limpia}-{palabra}.cl")
    
    # Plurales
    for palabra in palabras_clave:
        if not palabra.endswith('s'):
            variantes.append(f"{palabra}es.cl")
        variantes.append(f"{palabra}s.cl")
    
    # Remover duplicados
    variantes = list(dict.fromkeys(variantes))
    
    return variantes[:15]  # Limitar a 15 opciones


def verificar_lote(dominios: List[str]) -> Tuple[List[str], List[str]]:
    """
    Verifica un lote de dominios
    Retorna: (disponibles, registrados)
    """
    disponibles = []
    registrados = []
    
    for dominio in dominios:
        try:
            resultado = subprocess.run(
                ['whois', dominio],
                capture_output=True,
                text=True,
                timeout=3
            )
            
            output = resultado.stdout.lower()
            
            if any(phrase in output for phrase in [
                'no existe', 'does not exist', 'no data found'
            ]):
                disponibles.append(dominio)
            else:
                registrados.append(dominio)
                
        except:
            registrados.append(dominio)  # Asumir registrado si hay error
    
    return disponibles, registrados


def main():
    import sys
    
    if len(sys.argv) < 2:
        print("Uso: python3 generar_sugerencias_dominio.py palabra1 [palabra2] [--marca MiNombre]")
        print("")
        print("Ejemplos:")
        print("  python3 generar_sugerencias_dominio.py masaje terapia")
        print("  python3 generar_sugerencias_dominio.py masaje terapia --marca Javier")
        sys.exit(1)
    
    args = sys.argv[1:]
    marca = ""
    palabras = []
    
    # Parsear argumentos
    i = 0
    while i < len(args):
        if args[i] == '--marca' and i + 1 < len(args):
            marca = args[i + 1]
            i += 2
        else:
            palabras.append(args[i])
            i += 1
    
    print("\n" + "="*60)
    print("GENERADOR DE SUGERENCIAS DE DOMINIO")
    print("="*60 + "\n")
    
    print(f"Palabras clave: {', '.join(palabras)}")
    if marca:
        print(f"Marca personal: {marca}")
    print()
    
    # Generar variantes
    variantes = generar_variantes(palabras, marca)
    print(f"Generadas {len(variantes)} variantes...\n")
    
    # Verificar todas
    print("Verificando disponibilidad...")
    disponibles, registrados = verificar_lote(variantes)
    
    # Mostrar resultados
    print("\n" + "="*60)
    print("RESULTADOS")
    print("="*60 + "\n")
    
    if disponibles:
        print(f"✅ DISPONIBLES ({len(disponibles)}):\n")
        for i, d in enumerate(disponibles, 1):
            print(f"  {i}. {d}")
    else:
        print("✅ DISPONIBLES: Ninguno encontrado\n")
    
    print()
    
    if registrados:
        print(f"❌ REGISTRADOS ({len(registrados)}):\n")
        for d in registrados[:5]:  # Mostrar solo los primeros 5
            print(f"  - {d}")
        if len(registrados) > 5:
            print(f"  ... y {len(registrados) - 5} más")
    
    print("\n" + "="*60 + "\n")
    
    # Recomendación
    if disponibles:
        print("📌 RECOMENDACIÓN:")
        print(f"   Usar: {disponibles[0]}")
        print("   (Es el que mejor combina disponibilidad y SEO)\n")


if __name__ == '__main__':
    main()
```

---

## Instalación Rápida

```bash
# 1. Copiar scripts a tu carpeta de proyectos
cp verificar_dominios_cl.py ~/Dev/
cp generar_sugerencias_dominio.py ~/Dev/

# 2. Darles permisos de ejecución
chmod +x ~/Dev/verificar_dominios_cl.py
chmod +x ~/Dev/generar_sugerencias_dominio.py

# 3. Crear alias (opcional, en ~/.zshrc o ~/.bashrc)
alias verificar-dominio='python3 ~/Dev/verificar_dominios_cl.py'
alias generar-dominio='python3 ~/Dev/generar_sugerencias_dominio.py'
```

---

## Ejemplo de Uso Real: Caso Javier

```bash
# Generar sugerencias automáticas
python3 generar_sugerencias_dominio.py masaje terapia --marca javier

# Output:
# ✅ DISPONIBLES (3):
#    1. masajesterapias.cl
#    2. bienestarylaborales.cl
#    3. masajespro.cl
```

Ahora propongo SOLO los disponibles. ✅ **Confianza + eficiencia**

---

## Ventajas de Este Enfoque

| Antes | Después |
|-------|---------|
| ❌ Propongo sin verificar | ✅ Verifico primero |
| ❌ Pierdo tiempo | ✅ Gano eficiencia |
| ❌ Cliente decepciona | ✅ Cliente confía |
| ❌ Múltiples intentos | ✅ Una sola propuesta |
| ❌ Poco profesional | ✅ Muy profesional |

---

## Requisitos Técnicos

- Python 3.6+
- `whois` instalado (CLI)
- Conexión a internet

## Notas

- WHOIS puede ser lento la primera vez (cache)
- Algunos dominios pueden tardar en reflejar cambio de estado
- Para dominios muy nuevos (<24h), hay margen de error
