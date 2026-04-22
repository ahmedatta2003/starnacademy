import StudentShowcase from "@/components/StudentShowcase";
import StudentSuccess from "@/components/StudentSuccess";
import ShowcaseProjects from "@/components/ShowcaseProjects";

/**
 * Results section: combines real student outcomes, success stories, and
 * project showcases — concrete proof for parents.
 */
const Results = () => (
  <div id="results">
    <StudentShowcase />
    <StudentSuccess />
    <ShowcaseProjects />
  </div>
);

export default Results;
