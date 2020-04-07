<template>
    <div >
        <div v-show="isGameStarted" class="score">
            <p>Scores:</p>
            <p><b>Team #1:</b> {{team1Score}}</p>
            <p><b>Team #2:</b> {{team2Score}}</p>
        </div>
    </div>
    
</template>

<script>
export default {
    props: {
        isGameStarted: {
            type: Boolean,
            required: true
        },
        team1Score: {
            type: Number,
            required: true
        },
        team2Score: {
            type: Number,
            required: true
        },
    },
    
}
</script>

<style scoped>
.score{
    margin-right: 25px;
    float: right;
    border: 1px solid #d8d8d8;
    padding: 5px 20px;
}
</style>