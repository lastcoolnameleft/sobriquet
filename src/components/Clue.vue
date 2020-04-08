<template>
    <div>
        <p>
            Your clue is: <b>{{clue.name}}</b>
        </p>
        <p>
            Description: {{clue.description}}
        </p>
        <p>
            Points: {{clue.points}}
        </p>
        <p>
            Category: {{clue.category}}
        </p>
    </div>
</template>

<script>
export default {
    props: {
        clue: {
            type: Object,
            required: true
        },
    },
}
</script>