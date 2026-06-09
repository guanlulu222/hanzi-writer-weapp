#!/usr/bin/env python3
"""
hanzi-writer-miniprogram 一键构建脚本

功能：编译修改后的 HanziWriter 源码 → 注入 xgzb-mini 小程序 → 自动预览

用法：
  python build-mp.py [--preview]
"""

import sys
import os
import subprocess
from pathlib import Path

# ── 路径配置 ──────────────────────────────
FORK_DIR = Path(r'D:\project\opensource\hanzi-writer-miniprogram')
MINI_PROJECT = Path(r'D:\project\xgzb\xgzb-mini')
HW_DIST = FORK_DIR / 'dist' / 'index.cjs.js'
HW_TARGET = MINI_PROJECT / 'miniprogram' / 'subpkg' / 'editor' / 'miniprogram_npm' / 'hanzi-writer' / 'index.js'
PREVIEW_SCRIPT = Path.home() / '.workbuddy' / 'skills' / 'wx-devtools-api' / 'scripts' / 'wx-devtools-api.js'

def run(cmd, cwd=None, timeout=120):
    """运行命令并返回 (success, output)"""
    try:
        result = subprocess.run(
            cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout,
            shell=True
        )
        if result.returncode != 0:
            print('[FAIL]', cmd[:60])
            if result.stderr.strip():
                print(result.stderr.strip()[:500])
            return False, result.stderr
        return True, result.stdout
    except subprocess.TimeoutExpired:
        print('[TIMEOUT]', cmd[:60])
        return False, ''
    except Exception as e:
        print('[ERROR]', cmd[:60], ':', e)
        return False, ''

def step_build():
    """Step 1: 编译 HanziWriter"""
    print('\n[1/3] 编译 HanziWriter...')

    if not FORK_DIR.exists():
        print(f'[ERROR] HanziWriter fork 目录不存在: {FORK_DIR}')
        return False

    rollup_cmd = f'cd /d "{FORK_DIR}" && ".\\node_modules\\.bin\\rollup" -c'
    ok, result = run(rollup_cmd, timeout=90)

    if not ok:
        print('[WARN] 构建失败，尝试安装依赖...')
        ok2, _ = run(f'npm install --prefer-offline', cwd=str(FORK_DIR), timeout=120)
        if not ok2:
            print('[ERROR] npm install 失败，请手动安装依赖')
            return False
        ok, result = run(rollup_cmd, timeout=90)
        if not ok:
            print('[ERROR] rollup 构建失败，请检查源码')
            return False

    if not HW_DIST.exists():
        print(f'[ERROR] 构建产物不存在: {HW_DIST}')
        return False

    size_kb = HW_DIST.stat().st_size / 1024
    print(f'   OK 构建成功 ({size_kb:.1f} KB)')
    return True

def step_inject():
    """Step 2: 注入到小程序项目"""
    print('\n[2/3] 注入到小程序...')

    # 读取构建产物
    with open(HW_DIST, 'r', encoding='utf-8') as f:
        code = f.read()

    # 移除 module.exports 和 sourcemap 行
    lines = code.strip().split('\n')
    clean = []
    for line in lines:
        s = line.strip()
        if s.startswith('module.exports =') or s.startswith('//# sourceMappingURL'):
            continue
        clean.append(line)
    body = '\n'.join(clean)

    # 组装最终文件
    wrapper = f'''// HanziWriter mini program build (auto-generated from hanzi-writer-miniprogram fork)
{body}

module.exports = HanziWriter;
'''

    # 确保目标目录存在
    HW_TARGET.parent.mkdir(parents=True, exist_ok=True)

    # 写入
    with open(HW_TARGET, 'w', encoding='utf-8') as f:
        f.write(wrapper)

    line_count = len(wrapper.split('\n'))
    print(f'   OK 已注入 ({line_count} 行)')
    return True

def step_preview():
    """Step 3: 自动预览"""
    print('\n[3/3] 推送到开发者工具...')
    ok, result = run(f'node "{PREVIEW_SCRIPT}" autopreview "{MINI_PROJECT}"', timeout=30)
    if ok:
        print('   OK 预览已推送')
        return True
    else:
        print('   ✗ 预览推送失败')
        return False

def main():
    do_preview = '--preview' in sys.argv or '--no-preview' not in sys.argv

    for step in [step_build, step_inject]:
        if not step():
            sys.exit(1)

    if do_preview:
        if not step_preview():
            sys.exit(1)

    print('\n========================================')
    print('  全部完成!')
    if not do_preview:
        print('  提示: 加 --preview 可自动推送预览')
    print('========================================')

if __name__ == '__main__':
    main()
