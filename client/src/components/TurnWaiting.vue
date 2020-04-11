<template>
    <div>
        <p>Turn Details here</p>
        <button v-on:click="startTurn">START TURN</button>
    </div>
</template>

<script>
export default {
    props: {
        eventBus: {
            type: Object,
            required: true
        },
    },
    methods: {
        startTurn() {
            this.eventBus.$emit('start-turn')
        },
    }
}
</script>