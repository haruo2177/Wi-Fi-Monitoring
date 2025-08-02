# Network Monitor for Windows

Windows専用のネットワーク品質監視ツールです。

## 特徴

- **技術スタック**: PowerShell, netsh, WMI
- **権限要件**: 通常ユーザー（Wi-Fi詳細情報は管理者権限推奨）
- **自動実行**: Windows タスクスケジューラ
- **Wi-Fi情報取得**: netsh wlan, Get-WmiObject

## システム要件

- Windows 10/11
- PowerShell 5.1 以降
- Windows タスクスケジューラ

## 基本的な使用方法

```powershell
# 設定ファイル初期化
.\scripts\setup_config.ps1

# 単発実行
.\scripts\network_monitor.ps1

# 自動インストール（管理者権限で実行）
.\scripts\install.ps1
```

## Windows固有の機能

### Wi-Fi情報取得
- netsh wlanコマンドでプロファイル情報取得
- WMIでアダプター詳細情報取得
- 信号強度、チャンネル情報の取得

### タスクスケジューラ統合
- ユーザーログイン時に実行
- 指定間隔での定期実行
- システム起動時の自動開始

## 取得可能なWi-Fi情報

| 項目 | 説明 | Windows実装 |
|------|------|-------------|
| SSID | ネットワーク名 | netsh wlan show interfaces |
| Signal | 信号強度 | WMI Win32_NetworkAdapter |
| Channel | チャンネル | netsh wlan show profiles |
| LinkSpeed | リンク速度 | WMI情報から取得 |

## 制限事項

- 一部のWi-Fi詳細情報取得には管理者権限が必要
- Windows Defenderによる実行制限の可能性
- PowerShell実行ポリシーの設定が必要な場合有り