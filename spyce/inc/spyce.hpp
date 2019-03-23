#pragma once

#include <boost/python.hpp>

#include "SpiceUsr.h"

struct Frame {
    double x,y,z,dx,dy,dz;

    Frame(SpiceDouble *frame);
    Frame();
};

void init();

int str_to_id(std::string naif_id);
std::string id_to_str(int naif_id);

double utc_to_et(std::string date);
std::string et_to_utc(double et, std::string format);

void add_kernel(std::string s);
void remove_kernel(std::string s);

py::list get_objects(std::string file);
py::list get_coverage_windows(std::string file, int obj_id);

Frame get_frame_data(int target_id, int observer_id, double e_time);
