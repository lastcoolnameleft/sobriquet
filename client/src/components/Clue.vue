<template>
      <div class="card-container animated slideInRight">
        <h1 class="card-title">{{activeCard.name}}</h1>
        <p class="description">{{activeCard.description}}</p>
        <div class="dashed-line" ></div>
        <h3 class="category" style="color: rgb(0, 180, 239);">
          {{activeCard.category}}
        </h3>
        <div class="circle" style="background-color: rgb(0, 180, 239);">
          <h1 class="points">{{activeCard.points}}</h1>
        </div>
      </div>

</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters([
          'activeCard'
        ]),
        categoryColor() {
            return { color: 'rgba(76, 189, 159, 1)' }
        },
        pointColor() {
            return { backgroundColor: 'rgba(76, 189, 159, 1)' }
        }
    }

}
</script>

<style scoped>
@-webkit-keyframes slideInRight {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInRight {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

.slideInRight {
  -webkit-animation-name: slideInRight;
  animation-name: slideInRight;
}

.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

.animated.delay-1s {
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}

.animated.delay-2s {
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
}

.animated.delay-3s {
  -webkit-animation-delay: 3s;
  animation-delay: 3s;
}

.animated.delay-4s {
  -webkit-animation-delay: 4s;
  animation-delay: 4s;
}

.animated.delay-5s {
  -webkit-animation-delay: 5s;
  animation-delay: 5s;
}

.animated.fast {
  -webkit-animation-duration: 800ms;
  animation-duration: 800ms;
}

.animated.faster {
  -webkit-animation-duration: 500ms;
  animation-duration: 500ms;
}

.animated.slow {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
}

.animated.slower {
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
}

@media (prefers-reduced-motion) {
  .animated {
    -webkit-animation: unset !important;
    animation: unset !important;
    -webkit-transition: none !important;
    transition: none !important;
  }
}

.circle {
  text-align: center;
  width: 50px;
  height: 50px;
  margin: auto;
  display:flex;
  align-items: center;
  justify-content: center;
  height:45px;
  width:90px;
  border-radius: 90px 90px 0 0;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.points {
  text-align: center;
  color: #FFF;
  font-size: 1.4rem;
}

.category {
  text-align: center;
  font-size: 1rem;
  margin: 10px auto;

}

.card-container {
  position: relative;
  background-color: #FFF;
  width: 85%;
  height: 410px;
  margin: 20px auto;
  padding: 30px 25px 0 25px;
  border-radius: 15px;
  -webkit-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  -moz-box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.37);
}


@media (min-width: 375px) {
  .card-container {
    height: 71%;
    margin: 30px auto;
    padding: 30px 30px 0 30px;
  }

  .description {
    color: #555;
    font-size: 1.1rem;
    line-height: 1.6rem;
  }

  .dashed-line {
    margin: 30px auto;
  }

  .buttons-container {
    bottom: 5%;
  }
  
  .category {
    font-size: 1.1rem;
  }

}

@media (min-width: 411px) {
  
.pass-button {
  height: 45px;
}

.got-it-button {
  height: 45px;
}

.current-team {
  margin: 15px 0 15px 0;
}

.current-round {
  margin: 15px 0 15px 0;

}

}

@media (min-width: 620px) {
.play {
  width: 400px;
  margin: auto;
}

.buttons-container {
  width: 340px;
}

.card-container {
  width: 340px;
  height: 500px;
  margin: 20px auto;
  padding: 30px 25px 0 25px;
}

.buttons-container {
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  width: 85%;
  position: static;
  margin: auto;

}
}

.dashed-line {
  border-bottom: 2px dotted #999;
  width: 40%;
  margin: 20px auto;
}



</style>