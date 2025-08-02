# Network Monitor for Ubuntu/Linux

Ubuntu/Linux 専用のネットワーク品質監視ツールです。

## 特徴

- **技術スタック**: Bash, iwconfig, NetworkManager, systemd
- **権限要件**: 通常ユーザー（一部コマンドは sudo 推奨）
- **自動実行**: systemd service + timer
- **ネットワーク情報取得**: iwconfig, nmcli, iw

## システム要件

- Ubuntu 18.04 以降（または同等の Linux ディストリビューション）
- Bash 4.0 以降
- wireless-tools または iw パッケージ
- NetworkManager（推奨）

## 必要パッケージのインストール

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install wireless-tools iw net-tools iputils-ping

# 代替（新しいシステム）
sudo apt install iw net-tools iputils-ping
```

## 基本的な使用方法

```bash
# 設定ファイル初期化
./scripts/setup_config.sh

# 単発実行
./scripts/network_monitor.sh

# 自動インストール
sudo ./scripts/install.sh
```

## Ubuntu 固有の機能

### ネットワーク情報取得

- iwconfig でワイヤレス詳細情報取得
- nmcli で NetworkManager 情報取得
- iw コマンドで現代的なネットワーク情報取得

### systemd 統合

- systemd service として実行
- systemd timer で定期実行
- ユーザーサービスまたはシステムサービス選択可

## 取得可能なネットワーク情報

| 項目      | 説明           | Linux 実装        |
| --------- | -------------- | ----------------- |
| SSID      | ネットワーク名 | iwconfig, nmcli   |
| Signal    | 信号強度       | iwconfig, iw      |
| Noise     | ノイズレベル   | iwconfig          |
| Channel   | チャンネル     | iwconfig, iw      |
| LinkSpeed | リンク速度     | iwconfig, ethtool |

## 権限とセキュリティ

### 通常ユーザーで実行可能

- ping コマンド
- 基本的なネットワーク情報取得

### sudo 権限が推奨される項目

- 詳細なネットワーク情報取得
- システムサービスとしての登録
- 一部の iw コマンド機能

## 制限事項

- ディストリビューションによりコマンドの可用性が異なる
- 古いシステムでは iw コマンドが利用できない場合有り
- NetworkManager が無効な環境では一部機能制限有り
