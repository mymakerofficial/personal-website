<template>
  <Panel :id="project.name">
    <div class="panelHeader">
      <h1>{{project.displayName}}</h1>
    </div>
    <div class="panelBody">
      <p class="primary">{{project.summary}}</p>
      <p class="secondary">{{project.description}}</p>
      <div class="smallSection">
        <div v-if="project.tags !== null && project.tags.length > 0">
          <label>tags</label>
          <div><span class="listItem" v-for="tag in project.tags" :key="tag">{{tag.toLowerCase()}}</span></div>
        </div>
        <div v-if="project.timespan.year">
          <label>development</label>
          <div><span class="listItem">{{this.timespan}}</span><span class="listItem">({{project.developmentStatus}})</span></div>
        </div>
        <div v-if="project.collaborators !== null && project.collaborators.length > 0">
          <label>collaborators</label>
          <div><span class="listItem" v-for="collaborator in project.collaborators" :key="collaborator.name">{{collaborator.name}}</span></div>
        </div>
        <div v-if="project.positions !== null && project.positions.length > 0">
          <label>position</label>
          <div><span class="listItem" v-for="position in project.positions" :key="position">{{position.toLowerCase()}}</span></div>
        </div>
      </div>
    </div>
    <div class="panelFooter">
      <a :href="button.url" target="_blank" v-for="button in project.buttons" :key="button.text"><button>{{button.text}} <i class="mdi mdi-arrow-top-right"></i></button></a>
    </div>
  </Panel>
</template>

<script>
import Panel from "@/components/Panel";

export default {
  name: "ProjectPanel",
  components: {Panel},

  props: ["project"],

  computed: {
    timespan: function () { // convert start and end timestamps to a fancy formatted string
      // convert unixtimestamp to date
      let startDate = this.project.timespan.started !== null ? new Date(this.project.timespan.started * 1000) : null
      let endDate = this.project.timespan.finished !== null ? new Date(this.project.timespan.finished * 1000) : null

      // calculate the time between start and end in days. if a date is missing return infinite
      let timespanInDays = startDate && endDate ? Math.abs((startDate.getTime() - endDate.getTime()) / (1000 * 3600 * 24)) : Infinity

      // only show day if project was finished in one month
      let showDay = timespanInDays < 30;
      // show year on start if started and ended in different years
      let showYearOnStart = startDate == null || endDate == null || startDate.getFullYear() !== endDate.getFullYear();
      // only show year if project timespan is longer then a year
      let yearOnly = endDate !== null && timespanInDays > 365 && startDate !== null;

      // format start date
      let start = ""
      if(this.project.timespan.started !== null){
        let day = startDate.getDate(); // get day of the month
        let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(startDate) // get month in text
        let year = startDate.getFullYear(); // get year

        // generate start date string
        if(showDay) start += `${day} `
        start += `${month}`
        if(showYearOnStart) start += ` ${year}`
        if(yearOnly) start = ` ${year}` // overwrite if only year should be shown
      }

      // format start date
      let end = ""
      if(this.project.timespan.finished !== null){
        let day = endDate.getDate(); // get day of the month
        let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(endDate) // get month in text
        let year = endDate.getFullYear(); // get year

        // generate end date string
        if(showDay) end += `${day} `
        end += `${month} ${year}`
        if(yearOnly) end = `${year}` // overwrite if only year should be shown
      }

       // put it all together
      return `${startDate ? start : "unknown"} - ${endDate ? end : "present"}`;
    }
  }
}
</script>

<style scoped>

</style>