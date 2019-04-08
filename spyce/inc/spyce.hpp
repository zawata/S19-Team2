#pragma once

#include <boost/python.hpp>

#include "SpiceUsr.h"

struct Frame {
    double x,y,z,dx,dy,dz;

    Frame(SpiceDouble *frame);
    Frame();
};

namespace py = boost::python;

void        spyce_init();

int         spyce_str_to_id(std::string naif_id);
std::string spyce_id_to_str(int naif_id);

double      spyce_utc_to_et(std::string date);
std::string spyce_et_to_utc(double et, std::string format);

void        spyce_add_kernel(std::string s);
void        spyce_remove_kernel(std::string s);

py::list    spyce_get_objects(std::string file);
py::list    spyce_get_coverage_windows(std::string file, int obj_id);

Frame       spyce_get_frame_data(int target_id, int observer_id, double e_time);
