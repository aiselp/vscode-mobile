<template >
    <div :style="style" class="content">
        <Card>
            <Button @click="openSettings" type="primary" block>打开编辑器设置</Button>
        </Card>
        <Card class="item">
            <div class="body">
                <div>深色模式</div>
                <Dropdown>
                    <template #overlay>
                        <Menu>
                            <menu-item @click="() => switchTheme(theme)" v-for="theme in themeList">
                                {{ theme.name }}
                            </menu-item>
                        </Menu>
                    </template>
                    <Button>
                        {{ currentTheme.name }}
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
        </Card>
        <Card class="item">
            <div class="body">
                <div>顶部工具栏</div>
                <Switch v-model:checked="enableTopToolbar" />
            </div>
        </Card>
        <Card class="item">
            <div class="body">
                <div>底部工具栏</div>
                <Switch v-model:checked="enableBottomShortcuts" />
            </div>
        </Card>
        <Card class="item">
            <div @click="() => { }" class="body">
                <div>启用prettier格式化</div>
                <Switch v-model:checked="enable" />
            </div>
        </Card>
    </div>
</template>
<script setup lang="ts">
import { enableBottomShortcuts, enableTopToolbar } from '../core/appConfigs'
import { openSettings } from '../core/shortcutFunctions'
import { DownOutlined } from '@ant-design/icons-vue';
import {
    theme, Button,
    Dropdown, Menu, MenuItem, Card, Switch
} from "ant-design-vue";
import { themeList, currentTheme, switchTheme } from '../theme'
import { computed } from 'vue'
import { useIonRouter } from '@ionic/vue'
import { enable } from '../core/tools/prettier'

const router = useIonRouter()

const { token } = theme.useToken()
const style = computed(() => {
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