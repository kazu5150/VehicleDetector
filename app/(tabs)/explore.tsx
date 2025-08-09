import { StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#00FF00', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#00FF00"
          name="car.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">VehicleDetectorについて</ThemedText>
      </ThemedView>
      
      <ThemedText>
        VehicleDetectorは、最先端の機械学習技術を使用して、デバイスのカメラからリアルタイムで車両を検出するアプリです。
      </ThemedText>

      <Collapsible title="検出可能な車両">
        <ThemedText>
          このアプリは以下の車両タイプを検出できます：
        </ThemedText>
        <ThemedText type="defaultSemiBold">• 乗用車（一般的な自動車）</ThemedText>
        <ThemedText type="defaultSemiBold">• トラック（商用車両）</ThemedText>
        <ThemedText type="defaultSemiBold">• バス（公共交通機関）</ThemedText>
        <ThemedText>
          設定で信頼度の閾値を調整して、精度と感度のバランスを制御できます。
        </ThemedText>
      </Collapsible>

      <Collapsible title="使い方">
        <ThemedText>
          1. <ThemedText type="defaultSemiBold">カメラ</ThemedText>タブに移動
        </ThemedText>
        <ThemedText>
          2. カメラ権限を許可
        </ThemedText>
        <ThemedText>
          3. カメラを車両に向ける
        </ThemedText>
        <ThemedText>
          4. <ThemedText type="defaultSemiBold">検出開始</ThemedText>ボタンをタップ
        </ThemedText>
        <ThemedText>
          5. 歯車アイコンで設定を調整して最適なパフォーマンスを実現
        </ThemedText>
      </Collapsible>

      <Collapsible title="パフォーマンスのコツ">
        <ThemedText>
          最良の結果を得るには：
        </ThemedText>
        <ThemedText>• 明るい環境で使用する</ThemedText>
        <ThemedText>• 車両をカメラの視野内に明確に収める</ThemedText>
        <ThemedText>• バッテリーを節約するため設定でFPSを下げる</ThemedText>
        <ThemedText>• 誤検出を減らすため信頼度の閾値を上げる</ThemedText>
      </Collapsible>

      <Collapsible title="技術">
        <ThemedText>
          VehicleDetectorで使用している技術：
        </ThemedText>
        <ThemedText type="defaultSemiBold">• YOLO（You Only Look Once）ニューラルネットワーク</ThemedText>
        <ThemedText type="defaultSemiBold">• リアルタイム物体検出アルゴリズム</ThemedText>
        <ThemedText type="defaultSemiBold">• モバイル向けに最適化</ThemedText>
        <ThemedText>
          プライバシーと速度のため、すべての処理はデバイス内で実行されます。
        </ThemedText>
      </Collapsible>

      <Collapsible title="プライバシーとデータ">
        <ThemedText>
          あなたのプライバシーを大切にします：
        </ThemedText>
        <ThemedText>• すべての処理はデバイス内で実行</ThemedText>
        <ThemedText>• 画像やデータを外部サーバーに送信しません</ThemedText>
        <ThemedText>• カメラアクセスはリアルタイム検出のみに使用</ThemedText>
        <ThemedText>• 個人データの収集や保存はありません</ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
