<template >
    <div :style="style" class="content">
        <a-card>
            <a-button @click="openSettings" type="primary" block>打开编辑器设置</a-button>
        </a-card>
        <a-card class="item">
            <div class="body">
                <div>主题</div>
                <a-dropdown>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="() => switchTheme(theme)" v-for="theme in themeList">
                                {{ theme.name }}
                            </a-menu-item>
                        </a-menu>
                    </template>
                    <a-button>
                        {{ currentTheme.name }}
                        <DownOutlined />
                    </a-button>
                </a-dropdown>
            </div>
        </a-card>
        <a-card class="item">
            <div class="body">
                <div>顶部工具栏</div>
                <a-switch v-model:checked="enableTopToolbar" />
            </div>
        </a-card>
        <a-card class="item">
            <div class="body">
                <div>底部工具栏</div>
                <a-switch v-model:checked="enableBottomShortcuts" />
            </div>
        </a-card>
    </div>
</template>
<script setup lang="ts">
import { enableBottomShortcuts, enableTopToolbar } from '../core/appConfigs'
import { IonItem, IonLabel, IonList, IonInput, IonText, IonToggle } from '@ionic/vue';
import { openSettings } from '../core/shortcutFunctions'
import { save, arrowUndo, play, pencil, document } from 'ionicons/icons';
import { DownOutlined } from '@ant-design/icons-vue';
import { themeList, currentTheme, switchTheme } from '../theme'
import { theme } from 'ant-design-vue';
import { computed } from 'vue'

const style = computed(() => {
    const { token } = theme.useToken()
    return {
        "background-color": token.value.colorBgBase,
    }
})
</script>
<style scoped>
.content {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.item {
    width: 100%;
}

.item :deep(.ant-card-body) {
    width: 100%;
    padding: 12px;
}

.item .body {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>