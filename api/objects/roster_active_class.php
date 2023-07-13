<?php

require_once 'roster_class.php';
require_once 'roster_changes_class.php';

class Roster_active {
    public function get(int $data_id, string $yearweek) {
        $data_id    = trim($data_id);
        $yearweek   = trim($yearweek);
        $roster = new Roster(); 
        $row = $roster->get($data_id, $yearweek);
        $days       =  $row["days"];
        $time_step  = (float)$row["time_step"];
        $roster_array=array();
        for ($day_id=0; $day_id < count($days); $day_id++) {
            $roster_changes = new Roster_changes();
            $row_c = $roster_changes->getWhereYearweekLeDay($data_id, $yearweek, $day_id);
            $start  = $row_c["start"];
            $end    = $row_c["end"];
            $amount = $row_c["amount"];

            $time_array=array();
            for ($time_id=0; $time_id < count($amount); $time_id++) {
                $time_item=array(
                    "t" => $start+($time_step*$time_id),
                    "a" => $amount[$time_id]
                );
                array_push($time_array, $time_item);
            }

            $roster_item=array(
                "n"     => $days[$day_id],
                "d"     => $time_array
            );
            array_push($roster_array, $roster_item);
        }
        return $roster_array;
    }
}
