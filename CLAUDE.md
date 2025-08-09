# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native project built with Expo, named "VehicleDetector". It uses Expo Router for navigation with file-based routing, React Navigation, and supports iOS, Android, and Web platforms. The project uses the new React Native architecture and TypeScript throughout.

## Common Development Commands

- **Start development server**: `npm start` or `npx expo start`
- **Start on specific platform**: 
  - `npm run android` (Android emulator)
  - `npm run ios` (iOS simulator) 
  - `npm run web` (Web browser)
- **Lint code**: `npm run lint`
- **Reset project**: `npm run reset-project` (moves current app to app-example and creates fresh app directory)
- **Install dependencies**: `npm install`

## Architecture & Structure

### Core Framework Stack
- **React Native 0.79.5** with **React 19.0.0**
- **Expo SDK ~53.0.20** with router-based navigation
- **TypeScript 5.8.3** with strict mode enabled
- **React Navigation 7.x** with bottom tabs
- **React Native Reanimated 3.x** for animations

### File-Based Routing Structure
- `app/` - Main application directory using Expo Router
  - `_layout.tsx` - Root layout with theme provider and font loading
  - `(tabs)/` - Tab-based navigation group
    - `_layout.tsx` - Tab layout configuration with haptic feedback
    - `index.tsx` - Home screen
    - `explore.tsx` - Explore screen
  - `+not-found.tsx` - 404 error screen

### Component Organization
- `components/` - Reusable UI components
  - Core components: `ThemedText`, `ThemedView`, `ParallaxScrollView`
  - Interactive: `HapticTab`, `HelloWave`, `Collapsible`, `ExternalLink`
  - `ui/` - Platform-specific UI components (`IconSymbol`, `TabBarBackground`)
- `hooks/` - Custom React hooks (`useColorScheme`, `useThemeColor`)
- `constants/` - App constants like `Colors.ts`

### Key Features
- **Automatic theme switching** (light/dark mode) via `useColorScheme`
- **Platform-specific adaptations** for iOS, Android, and Web
- **Haptic feedback** on tab interactions
- **Custom font loading** (SpaceMono)
- **Path aliases** configured with `@/*` mapping to root

### TypeScript Configuration
- Uses `expo/tsconfig.base` with strict mode
- Path mapping: `@/*` points to project root
- Includes all `.ts/.tsx` files and Expo type definitions

### ESLint Configuration
- Uses `eslint-config-expo/flat` configuration
- Ignores `dist/*` directory

## Development Notes

### Project Reset Functionality
The `scripts/reset-project.js` utility moves the current implementation to `app-example/` and creates a minimal starter app. This is useful for starting fresh development while preserving the original example code.

### Asset Management
- Images stored in `assets/images/` with platform-specific variants
- Custom font in `assets/fonts/`
- App icons and splash screens configured in `app.json`

### Platform Support
- **iOS**: Supports tablets, uses transparent tab bar with blur effect
- **Android**: Edge-to-edge enabled, adaptive icon configured  
- **Web**: Uses Metro bundler with static output

### Navigation Architecture
The app uses a nested navigation structure:
1. Root Stack Navigator (in `app/_layout.tsx`)
2. Tab Navigator (in `app/(tabs)/_layout.tsx`) 
3. Individual screens as tab children

This project is set up as a starter template with placeholder content that should be replaced when building the actual VehicleDetector functionality.

---

# 車両検出アプリ MVP要件定義書

## 1. プロジェクト概要

### 1.1 プロジェクト名
**VehicleDetector** - リアルタイム車両検出アプリ

### 1.2 目的
YOLO機械学習モデルを使用して、iPhoneカメラ映像から車両をリアルタイム検出するMVPアプリを開発する

### 1.3 対象デバイス
- **プライマリ**: iPhone 11以降 (iOS 14.0+)
- **セカンダリ**: iPhone X以降での動作確認

### 1.4 開発期間
**3週間** (21営業日)

## 2. MVP機能要件

### 2.1 必須機能 (Must Have)

#### 2.1.1 カメラ機能
- リアカメラでの映像表示
- カメラ権限の適切な取得
- 縦向き固定での表示

#### 2.1.2 車両検出機能
- **検出対象**: 乗用車 (car)、トラック (truck)、バス (bus)
- **検出精度**: 信頼度80%以上のみ表示
- **検出頻度**: 5FPS (リソース効率化)
- **表示方法**: 緑色の矩形ボックスでオーバーレイ表示

#### 2.1.3 検出結果表示
- 検出された車両にラベル表示 (車種 + 信頼度)
- 画面上部に検出数をリアルタイム表示
- 検出ボックスの色分け (車種ごと)

#### 2.1.4 基本UI
- シンプルなフルスクリーンカメラビュー
- 検出ON/OFF切り替えボタン
- アプリ終了ボタン

### 2.2 推奨機能 (Should Have)

#### 2.2.1 パフォーマンス表示
- 現在のFPS表示
- 処理時間の表示
- バッテリー使用量の警告

#### 2.2.2 設定機能
- 検出信頼度の閾値調整 (50-90%)
- 検出頻度の調整 (1-10FPS)

### 2.3 将来機能 (Could Have)
- 検出履歴の保存
- 車両数の統計表示
- 写真/動画の保存機能
- 他の車両タイプの検出 (motorcycle, bicycle)

## 3. 技術要件

### 3.1 開発環境
- **フレームワーク**: React Native 0.72+
- **開発OS**: macOS (Xcode必須)
- **Node.js**: 18.0+
- **Xcode**: 14.0+

### 3.2 必須ライブラリ
```json
{
  "react-native-vision-camera": "^3.0.0",
  "react-native-worklets-core": "^0.2.4",
  "@tensorflow/tfjs": "^4.10.0",
  "@tensorflow/tfjs-react-native": "^0.8.0",
  "react-native-svg": "^13.4.0",
  "react-native-fs": "^2.20.0"
}
```

### 3.3 機械学習モデル
- **モデル**: YOLOv5s
- **フォーマット**: Core ML (.mlmodel)
- **サイズ制限**: 50MB以下
- **入力解像度**: 640x640
- **検出クラス**: COCO 80クラス (車両関連のみ使用)

### 3.4 パフォーマンス要件
- **起動時間**: 3秒以内
- **検出遅延**: 200ms以内
- **メモリ使用量**: 200MB以下
- **バッテリー消費**: 1時間使用で20%以下

## 4. ユーザーストーリー

### 4.1 基本利用シナリオ
```
As a ユーザー
I want to アプリを起動してカメラを向ける
So that 映像内の車両を自動で検出できる
```

**詳細**:
1. アプリアイコンをタップして起動
2. カメラ権限を許可
3. 車や道路にカメラを向ける
4. 車両が緑の枠で囲まれて表示される
5. 車種と信頼度がラベルで表示される

### 4.2 設定変更シナリオ
```
As a ユーザー
I want to 検出感度を調整する
So that 精度と速度のバランスを調整できる
```

### 4.3 エラー対応シナリオ
```
As a ユーザー
I want to カメラエラーが発生した場合
So that 適切なエラーメッセージと対処法が表示される
```

## 5. UI/UX要件

### 5.1 画面構成

#### 5.1.1 メイン画面 (カメラビュー)
```
[ステータスバー]
[検出数: 3台]  [FPS: 8]    [設定ボタン]

    [フルスクリーンカメラ映像]
    ┌─────────────┐
    │    [car 85%] │  ← 検出ラベル
    │ ┌─────────┐ │
    │ │         │ │  ← 検出ボックス
    │ │   車両   │ │
    │ │         │ │
    │ └─────────┘ │
    └─────────────┘

[検出ON/OFF]    [終了]
```

#### 5.1.2 設定画面
```
設定
├── 検出感度調整 (50-90%)
├── 検出頻度調整 (1-10FPS)
├── 表示色設定
└── バージョン情報
```

### 5.2 カラーパレット
- **プライマリ**: #00FF00 (検出ボックス)
- **セカンダリ**: #FFFFFF (テキスト)
- **背景**: #000000 (半透明オーバーレイ)
- **エラー**: #FF0000

### 5.3 レスポンシブ対応
- iPhone画面サイズに自動調整
- 安全領域 (Safe Area) への対応
- ダークモード対応 (将来機能)

## 6. 開発スケジュール

### Week 1: 基盤構築 (5日)
- [Day 1] React Nativeプロジェクト作成、環境構築
- [Day 2] カメラ機能実装、権限管理
- [Day 3] YOLOモデル準備、Core ML変換
- [Day 4] 基本UI実装
- [Day 5] 静止画での検出テスト

### Week 2: 検出機能開発 (5日)
- [Day 6-7] Core MLネイティブモジュール実装
- [Day 8-9] リアルタイム検出パイプライン構築
- [Day 10] 検出結果のオーバーレイ表示

### Week 3: 最適化・完成 (5日)
- [Day 11-12] パフォーマンス最適化
- [Day 13-14] UI/UX改善、設定機能追加
- [Day 15] テスト、バグ修正、リリース準備

## 7. 品質要件

### 7.1 機能テスト
- [ ] カメラ起動/終了
- [ ] 車両検出精度テスト (晴天、曇天、夜間)
- [ ] 複数車両同時検出
- [ ] 設定変更の反映
- [ ] エラーハンドリング

### 7.2 パフォーマンステスト
- [ ] 連続使用1時間でのメモリリーク確認
- [ ] バッテリー消費量測定
- [ ] 各種iPhone機種での動作確認
- [ ] 低照度環境での検出性能

### 7.3 ユーザビリティテスト
- [ ] 初回起動時の使いやすさ
- [ ] 検出結果の視認性
- [ ] レスポンス時間の体感評価

## 8. リスクと対策

### 8.1 技術リスク
| リスク | 影響度 | 対策 |
|--------|--------|------|
| Core ML統合の複雑性 | 高 | 事前のプロトタイプ作成 |
| パフォーマンス不足 | 中 | モデル軽量化、最適化 |
| iOSバージョン互換性 | 中 | 幅広いテスト環境 |

### 8.2 スケジュールリスク
| リスク | 影響度 | 対策 |
|--------|--------|------|
| 開発遅延 | 中 | バッファ日程の確保 |
| 機能過多 | 低 | MVP範囲の厳格な管理 |

## 9. 成功指標 (KPI)

### 9.1 技術指標
- **検出精度**: 90%以上 (昼間の明るい環境)
- **レスポンス時間**: 200ms以内
- **アプリクラッシュ率**: 1%未満
- **FPS**: iPhone 11で10FPS以上

### 9.2 ユーザー体験指標
- **起動から検出まで**: 5秒以内
- **誤検出率**: 10%以下
- **継続使用時間**: 30分以上 (バッテリー許容範囲)

## 10. リリース計画

### 10.1 MVP完成条件
- 基本的な車両検出が動作
- iPhone実機でのテスト完了
- 主要バグの修正完了
- パフォーマンス要件の達成

### 10.2 今後の拡張計画
- Phase 2: 検出履歴、統計機能
- Phase 3: 他の物体検出 (人、信号機等)
- Phase 4: Android版の開発
- Phase 5: リアルタイム位置情報連携

---

**承認**: 
- プロジェクトオーナー: [ ]
- 技術責任者: [ ]
- 開発者: [ ]

**最終更新**: 2025年8月9日