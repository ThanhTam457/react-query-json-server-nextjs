import { Badge } from "react-bootstrap";

type props = {
    completed: boolean
}

const BadgeCustom = (props: props) => {
    let bg: string = ""
    let icon: string = ""
    let textCompleted:string = ""

    if (props.completed) {
        bg = "success"
        icon = "circle-check"
        textCompleted = "Done !"
    } else {
        bg = "danger"
        icon = "circle-xmark"
        textCompleted = "Not Done !"
    }
    
    return ( 
        <Badge bg={bg} className="px-2 py-1"><i className={`fa-solid fa-${icon} me-2`}></i>{textCompleted}</Badge>
    );
}
 
export default BadgeCustom;